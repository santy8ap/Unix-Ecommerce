/**
 * API: Gestión de Outfits Guardados
 * GET /api/outfits - Listar outfits del usuario
 * POST /api/outfits - Guardar nuevo outfit
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

/**
 * GET - Obtener todos los outfits del usuario
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // Query params para filtrado
        const { searchParams } = new URL(req.url)
        const occasion = searchParams.get('occasion')
        const season = searchParams.get('season')
        const favorite = searchParams.get('favorite')
        const aiGenerated = searchParams.get('aiGenerated')

        const whereClause: any = {
            userId: user.id,
        }

        if (occasion) whereClause.occasion = occasion
        if (season) whereClause.season = season
        if (favorite) whereClause.favorite = favorite === 'true'
        if (aiGenerated) whereClause.aiGenerated = aiGenerated === 'true'

        const outfits = await prisma.outfit.findMany({
            where: whereClause,
            orderBy: [
                { favorite: 'desc' }, // Favoritos primero
                { createdAt: 'desc' },
            ],
        })

        // Parse JSON fields
        // Note: Prisma returns Json type natively, no parse needed if it matches
        const parsedOutfits = outfits.map((outfit) => ({
            ...outfit,
            items: outfit.items,
        }))

        return NextResponse.json({
            success: true,
            outfits: parsedOutfits,
            total: outfits.length,
        })
    } catch (error) {
        console.error('Error obteniendo outfits:', error)
        return NextResponse.json({ error: 'Error obteniendo outfits' }, { status: 500 })
    }
}

/**
 * POST - Guardar nuevo outfit
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const body = await req.json()
        const { name, description, items, occasion, season, aiGenerated = false } = body

        // Validaciones
        if (!name || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'name e items (array no vacío) son requeridos' },
                { status: 400 }
            )
        }

        // Validar ocasión
        const validOccasions = ['casual', 'formal', 'party', 'business', 'date', 'sport', 'other']
        if (occasion && !validOccasions.includes(occasion)) {
            return NextResponse.json(
                { error: `Ocasión inválida. Debe ser: ${validOccasions.join(', ')}` },
                { status: 400 }
            )
        }

        // Validar temporada
        const validSeasons = ['spring', 'summer', 'autumn', 'winter', 'all-season']
        if (season && !validSeasons.includes(season)) {
            return NextResponse.json(
                { error: `Temporada inválida. Debe ser: ${validSeasons.join(', ')}` },
                { status: 400 }
            )
        }

        // Crear outfit
        const outfit = await prisma.outfit.create({
            data: {
                userId: user.id,
                name,
                description: description || null,
                items: items, // Native JSON support
                occasion: occasion || null,
                season: season || null,
                aiGenerated,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Outfit guardado exitosamente',
            outfit: {
                ...outfit,
                items: outfit.items,
            },
        })
    } catch (error) {
        console.error('Error guardando outfit:', error)
        return NextResponse.json({ error: 'Error guardando outfit' }, { status: 500 })
    }
}
