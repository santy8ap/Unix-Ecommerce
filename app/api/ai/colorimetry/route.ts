/**
 * API: Análisis de Colorimetría (UNIX)
 * POST /api/ai/colorimetry - Generar análisis de colorimetría con IA
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { generateColorimetryAnalysis } from '@/lib/services/ai/gemini'
import { rateLimits } from '@/lib/rateLimit'
import {
    getColorPalette,
    determineSeason,
    getColorimetryRecommendations,
    type SkinTone,
    type Undertone,
} from '@/lib/colorimetry'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Rate limiting: 10 análisis por día
        const rateLimitResult = rateLimits.colorimetry.check(session.user.email)
        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: 'Límite de análisis alcanzado',
                    message: 'Has alcanzado el límite de 10 análisis por día',
                    resetTime: new Date(rateLimitResult.resetTime).toISOString(),
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '10',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
                    },
                }
            )
        }

        const body = await req.json()
        const { skinTone, hairColor, eyeColor, useAI = true } = body

        // Validación
        const validSkinTones = ['warm', 'cool', 'neutral']
        if (!skinTone || !validSkinTones.includes(skinTone)) {
            return NextResponse.json(
                { error: 'skinTone es requerido y debe ser: warm, cool, o neutral' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        let analysis

        if (useAI) {
            // Generar análisis con IA (Gemini)
            try {
                analysis = await generateColorimetryAnalysis({
                    skinTone,
                    hairColor,
                    eyeColor,
                })
            } catch (aiError) {
                console.error('Error con IA, usando lógica estática:', aiError)
                // Fallback a lógica estática
                analysis = generateStaticAnalysis(skinTone as SkinTone)
            }
        } else {
            // Usar lógica estática
            analysis = generateStaticAnalysis(skinTone as SkinTone)
        }

        // Guardar resultado en la base de datos
        const colorimetryResult = await prisma.colorimetryResult.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                skinTone: analysis.skinTone,
                season: analysis.season,
                undertone: analysis.undertone,
                bestColors: analysis.bestColors,
                goodColors: analysis.goodColors || [],
                avoidColors: analysis.avoidColors || [],
                recommendations: analysis.recommendations,
                aiGenerated: useAI,
                confidence: 0.85,
            },
            update: {
                skinTone: analysis.skinTone,
                season: analysis.season,
                undertone: analysis.undertone,
                bestColors: analysis.bestColors,
                goodColors: analysis.goodColors || [],
                avoidColors: analysis.avoidColors || [],
                recommendations: analysis.recommendations,
                aiGenerated: useAI,
                confidence: 0.85,
                updatedAt: new Date(),
            },
        })

        // Actualizar preferencias del usuario
        await prisma.user.update({
            where: { id: user.id },
            data: {
                skinTone: analysis.skinTone,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Análisis de colorimetría completado',
            analysis: {
                id: colorimetryResult.id,
                skinTone: colorimetryResult.skinTone,
                season: colorimetryResult.season,
                undertone: colorimetryResult.undertone,
                bestColors: colorimetryResult.bestColors,
                goodColors: colorimetryResult.goodColors || [],
                avoidColors: colorimetryResult.avoidColors || [],
                recommendations: colorimetryResult.recommendations || null,
                aiGenerated: colorimetryResult.aiGenerated,
                confidence: colorimetryResult.confidence,
            },
        })
    } catch (error) {
        console.error('Error en análisis de colorimetría:', error)
        return NextResponse.json(
            { error: 'Error generando análisis de colorimetría' },
            { status: 500 }
        )
    }
}

/**
 * Genera análisis usando lógica estática (sin IA)
 */
function generateStaticAnalysis(skinTone: SkinTone) {
    const palette = getColorPalette(skinTone)
    const season = determineSeason(skinTone)
    const recommendations = getColorimetryRecommendations(skinTone, season)

    return {
        skinTone,
        season,
        undertone: skinTone === 'warm' ? ('golden' as Undertone) : ('pink' as Undertone),
        bestColors: palette.bestColors.map((c) => c.hex),
        goodColors: palette.goodColors.map((c) => c.hex),
        avoidColors: palette.avoidColors.map((c) => c.hex),
        recommendations: {
            metals: recommendations.metals,
            patterns: recommendations.patterns,
            fabrics: recommendations.fabrics,
            generalTips: recommendations.generalTips,
        },
    }
}
