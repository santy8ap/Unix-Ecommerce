import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { productIds } = await request.json()

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return NextResponse.json({ products: [] })
        }

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                active: true,
            },
            select: {
                id: true,
                name: true,
                price: true,
                images: true,
                category: true,
                stock: true,
            },
        })

        // Return in the same order as productIds
        const orderedProducts = productIds
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean)

        return NextResponse.json({ products: orderedProducts })
    } catch (error) {
        console.error('Error fetching recently viewed products:', error)
        return NextResponse.json(
            { error: 'Error al cargar productos' },
            { status: 500 }
        )
    }
}
