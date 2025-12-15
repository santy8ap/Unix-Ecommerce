import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET - Obtener reviews de un producto
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json({ error: 'productId required' }, { status: 400 })
        }

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Calcular estadísticas
        const stats = {
            total: reviews.length,
            average: reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0,
            distribution: {
                5: reviews.filter(r => r.rating === 5).length,
                4: reviews.filter(r => r.rating === 4).length,
                3: reviews.filter(r => r.rating === 3).length,
                2: reviews.filter(r => r.rating === 2).length,
                1: reviews.filter(r => r.rating === 1).length,
            }
        }

        return NextResponse.json({ reviews, stats })
    } catch (error) {
        logger.error('Error fetching reviews', error, { context: 'REVIEWS_API' })
        return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 })
    }
}

// POST - Crear nueva review
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { productId, rating, title, comment, images } = body

        // Validaciones
        if (!productId || !rating || !title || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
        }

        // Verificar si el producto existe
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Verificar si el usuario ya dejó review para este producto
        const existingReview = await prisma.review.findFirst({
            where: {
                productId,
                userId: session.user.id
            }
        })

        if (existingReview) {
            return NextResponse.json({ error: 'You already reviewed this product' }, { status: 400 })
        }

        // Verificar si es compra verificada
        const purchase = await prisma.order.findFirst({
            where: {
                userId: session.user.id,
                items: {
                    some: {
                        productId
                    }
                },
                paymentStatus: 'completed'
            }
        })

        const review = await prisma.review.create({
            data: {
                productId,
                userId: session.user.id,
                rating,
                title,
                comment,
                images: images || null,
                verifiedPurchase: !!purchase
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                }
            }
        })

        logger.info('Review created', {
            context: 'REVIEWS_API',
            metadata: { reviewId: review.id, productId, rating }
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        logger.error('Error creating review', error, { context: 'REVIEWS_API' })
        return NextResponse.json({ error: 'Error creating review' }, { status: 500 })
    }
}
