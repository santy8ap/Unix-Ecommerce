/**
 * API: Generador de Outfits con IA (UNIX)
 * POST /api/ai/outfits - Generar outfits usando el closet del usuario
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { generateOutfits } from '@/lib/services/ai/gemini'
import { rateLimits } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Rate limiting: 30 outfits por día
        const rateLimitResult = rateLimits.outfits.check(session.user.email)
        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: 'Límite de generación alcanzado',
                    message: 'Has alcanzado el límite de 30 outfits por día',
                    resetTime: new Date(rateLimitResult.resetTime).toISOString(),
                },
                { status: 429 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                closetItems: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // Validar que el usuario tenga items en su closet
        if (!user.closetItems || user.closetItems.length === 0) {
            return NextResponse.json(
                {
                    error: 'Tu closet está vacío. Agrega algunas prendas primero.',
                    emptyCloset: true,
                },
                { status: 400 }
            )
        }

        const body = await req.json()
        const { occasion = 'casual', season, numberOfOutfits = 3, saveOutfits = false } = body

        const validOccasions = ['casual', 'formal', 'party', 'business', 'date', 'sport', 'everyday']
        if (!validOccasions.includes(occasion)) {
            return NextResponse.json(
                {
                    error: `Ocasión inválida. Debe ser una de: ${validOccasions.join(', ')}`,
                },
                { status: 400 }
            )
        }

        // Preparar items del closet para el prompt
        const closetItems = user.closetItems.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            color: item.color,
            brand: item.brand || undefined,
        }))

        // Generar outfits con IA
        let outfits
        try {
            outfits = await generateOutfits({
                closetItems,
                userPreferences: {
                    skinTone: user.skinTone || undefined,
                    styleType: user.styleType || undefined,
                },
                occasion,
                season,
                numberOfOutfits,
            })
        } catch (aiError) {
            console.error('Error generando outfits con IA:', aiError)
            return NextResponse.json(
                {
                    error: 'Error generando outfits con IA. Intenta de nuevo más tarde.',
                    details: aiError instanceof Error ? aiError.message : 'Error desconocido',
                },
                { status: 500 }
            )
        }

        // Guardar outfits si se solicita
        if (saveOutfits && outfits && outfits.length > 0) {
            for (const outfit of outfits) {
                await prisma.outfit.create({
                    data: {
                        userId: user.id,
                        name: outfit.name,
                        description: outfit.description,
                        items: outfit.items as any, // Native JSON
                        occasion,
                        season: season || null,
                        aiGenerated: true,
                    },
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: `${outfits.length} outfits generados exitosamente`,
            outfits,
            saved: saveOutfits,
        })
    } catch (error) {
        console.error('Error en generador de outfits:', error)
        return NextResponse.json({ error: 'Error generando outfits' }, { status: 500 })
    }
}
