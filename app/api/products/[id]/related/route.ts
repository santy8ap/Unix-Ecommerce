import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params

        // Obtener el producto actual
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { category: true, styleTypes: true, colors: true }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Buscar productos relacionados por categoría y estilos similares
        const relatedProducts = await prisma.product.findMany({
            where: {
                AND: [
                    { id: { not: productId } }, // Excluir el producto actual
                    { active: true },
                    {
                        OR: [
                            { category: product.category }, // Misma categoría
                            {
                                styleTypes: {
                                    hasSome: product.styleTypes // Estilos en común
                                }
                            }
                        ]
                    }
                ]
            },
            take: 8,
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        logger.info('Related products fetched', {
            context: 'PRODUCTS_API',
            metadata: { productId, count: relatedProducts.length }
        })

        return NextResponse.json({ products: relatedProducts })
    } catch (error) {
        logger.error('Error fetching related products', error, { context: 'PRODUCTS_API' })
        return NextResponse.json({ error: 'Error fetching related products' }, { status: 500 })
    }
}
