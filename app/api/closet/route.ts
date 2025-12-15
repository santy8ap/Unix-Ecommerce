/**
 * API: Gestión del Smart Closet (UNIX)
 * GET /api/closet - Obtener todos los items del closet del usuario
 * PATCH /api/closet - Actualizar un item del closet
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // Obtener parámetros de query
        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category')
        const favorite = searchParams.get('favorite')
        const source = searchParams.get('source')

        // Construir filtros
        const where: any = {
            userId: user.id,
        }

        if (category) {
            where.category = category
        }

        if (favorite === 'true') {
            where.favorite = true
        }

        if (source) {
            where.source = source
        }

        const closetItems = await prisma.closetItem.findMany({
            where,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        // Parsear colores JSON
        const items = closetItems.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            color: item.color,
            colors: item.colors ? JSON.parse(item.colors) : null,
            image: item.image,
            brand: item.brand,
            size: item.size,
            price: item.price,
            source: item.source,
            favorite: item.favorite,
            timesWorn: item.timesWorn,
            lastWorn: item.lastWorn,
            notes: item.notes,
            createdAt: item.createdAt,
            product: item.product,
        }))

        return NextResponse.json({
            success: true,
            count: items.length,
            items,
        })
    } catch (error) {
        console.error('Error obteniendo closet:', error)
        return NextResponse.json({ error: 'Error obteniendo items del closet' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const body = await req.json()
        const { id, favorite, notes, timesWorn, lastWorn } = body

        if (!id) {
            return NextResponse.json({ error: 'ID del item es requerido' }, { status: 400 })
        }

        // Verificar que el item pertenece al usuario
        const existingItem = await prisma.closetItem.findFirst({
            where: {
                id,
                userId: user.id,
            },
        })

        if (!existingItem) {
            return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
        }

        // Actualizar item
        const updatedItem = await prisma.closetItem.update({
            where: { id },
            data: {
                ...(typeof favorite === 'boolean' && { favorite }),
                ...(notes !== undefined && { notes }),
                ...(timesWorn !== undefined && { timesWorn }),
                ...(lastWorn !== undefined && { lastWorn: new Date(lastWorn) }),
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Item actualizado exitosamente',
            item: {
                id: updatedItem.id,
                favorite: updatedItem.favorite,
                timesWorn: updatedItem.timesWorn,
                lastWorn: updatedItem.lastWorn,
                notes: updatedItem.notes,
            },
        })
    } catch (error) {
        console.error('Error actualizando item del closet:', error)
        return NextResponse.json({ error: 'Error actualizando item del closet' }, { status: 500 })
    }
}
