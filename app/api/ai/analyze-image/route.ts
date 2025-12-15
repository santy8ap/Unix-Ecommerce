/**
 * API: Análisis de Imagen con IA
 * POST /api/ai/analyze-image
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { rateLimits } from '@/lib/rateLimit'
import {
    analyzeSkinToneFromImage,
    analyzeClothingItem,
    analyzeOutfit,
    extractColorPalette,
} from '@/lib/ai/vision'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Rate limiting
        const rateLimitResult = rateLimits.colorimetry.check(session.user.email)
        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: 'Límite alcanzado',
                    message: 'Has alcanzado el límite de análisis de imágenes por día',
                },
                { status: 429 }
            )
        }

        const formData = await req.formData()
        const image = formData.get('image') as File
        const analysisType = formData.get('type') as string

        if (!image) {
            return NextResponse.json({ error: 'No se proporcionó imagen' }, { status: 400 })
        }

        // Validar tipo de archivo
        if (!image.type.startsWith('image/')) {
            return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 })
        }

        // Validar tamaño (max 5MB)
        if (image.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'La imagen es demasiado grande (max 5MB)' }, { status: 400 })
        }

        let result

        switch (analysisType) {
            case 'skin-tone':
                result = await analyzeSkinToneFromImage(image)

                // Guardar resultado automáticamente en la DB
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: session.user.email },
                    })

                    if (user) {
                        await prisma.colorimetryResult.upsert({
                            where: { userId: user.id },
                            create: {
                                userId: user.id,
                                skinTone: result.skinTone,
                                season: result.season || null,
                                undertone: result.undertone || null,
                                bestColors: result.recommendations?.bestColors || [],
                                goodColors: [],
                                avoidColors: result.recommendations?.avoidColors || [],
                                recommendations: result.recommendations || {},
                                aiGenerated: true,
                                confidence: result.confidence || 0.85,
                            },
                            update: {
                                skinTone: result.skinTone,
                                season: result.season || null,
                                undertone: result.undertone || null,
                                bestColors: result.recommendations?.bestColors || [],
                                goodColors: [],
                                avoidColors: result.recommendations?.avoidColors || [],
                                recommendations: result.recommendations || {},
                                aiGenerated: true,
                                confidence: result.confidence || 0.85,
                                updatedAt: new Date(),
                            },
                        })

                        // Actualizar skinTone del usuario
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { skinTone: result.skinTone },
                        })
                    }
                } catch (dbError) {
                    console.error('Error guardando resultado de colorimetría:', dbError)
                    // No fallar la request si falla el guardado
                }
                break

            case 'clothing':
                result = await analyzeClothingItem(image)
                break

            case 'outfit':
                result = await analyzeOutfit(image)
                break

            case 'palette':
                result = await extractColorPalette(image)
                break

            default:
                return NextResponse.json({ error: 'Tipo de análisis no válido' }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            type: analysisType,
            data: result,
        })
    } catch (error: any) {
        console.error('Error in image analysis:', error)
        return NextResponse.json(
            { error: error.message || 'Error analizando la imagen' },
            { status: 500 }
        )
    }
}
