/**
 * API: Agregar item al Smart Closet (UNIX)
 * POST /api/closet/add - Agregar prenda al closet del usuario
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
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
        const {
            productId,
            name,
            category,
            color,
            colors,
            image,
            brand,
            size,
            price,
            source = 'user',
            notes,
        } = body

        // Validaciones
        if (!name || !category || !color) {
            return NextResponse.json(
                { error: 'name, category y color son campos requeridos' },
                { status: 400 }
            )
        }

        const validCategories = [
            'shirt',
            'pants',
            'shoes',
            'dress',
            'jacket',
            'accessories',
            'shorts',
            'skirt',
            'sweater',
            'coat',
            'suit',
            'other',
        ]
        if (!validCategories.includes(category)) {
            return NextResponse.json(
                {
                    error: `Categoría inválida. Debe ser una de: ${validCategories.join(', ')}`,
                },
                { status: 400 }
            )
        }

        const validSources = ['user', 'store', 'gift']
        if (source && !validSources.includes(source)) {
            return NextResponse.json(
                { error: 'source inválido. Debe ser: user, store, o gift' },
                { status: 400 }
            )
        }

        // Si viene de un producto de la tienda, validar que existe
        if (productId) {
            const product = await prisma.product.findUnique({
                where: { id: productId },
            })

            if (!product) {
                return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
            }
        }

        // Crear item en el closet
        const closetItem = await prisma.closetItem.create({
            data: {
                userId: user.id,
                productId: productId || null,
                name,
                category,
                color: color.toLowerCase(),
                colors: colors ? JSON.stringify(colors) : null,
                image: image || null,
                brand: brand || null,
                size: size || null,
                price: price ? parseFloat(price) : null,
                source,
                notes: notes || null,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Prenda agregada al closet exitosamente',
            item: {
                id: closetItem.id,
                name: closetItem.name,
                category: closetItem.category,
                color: closetItem.color,
                colors: closetItem.colors ? JSON.parse(closetItem.colors) : null,
                image: closetItem.image,
                brand: closetItem.brand,
                size: closetItem.size,
                price: closetItem.price,
                source: closetItem.source,
                favorite: closetItem.favorite,
                timesWorn: closetItem.timesWorn,
                notes: closetItem.notes,
                createdAt: closetItem.createdAt,
            },
        })
    } catch (error) {
        console.error('Error agregando item al closet:', error)
        return NextResponse.json({ error: 'Error agregando prenda al closet' }, { status: 500 })
    }
}
