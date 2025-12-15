import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// PUT - Actualizar review
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const review = await prisma.review.findUnique({
            where: { id }
        })

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        // Solo el autor puede editar
        if (review.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { rating, title, comment, images } = body

        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                rating: rating || review.rating,
                title: title || review.title,
                comment: comment || review.comment,
                images: images !== undefined ? images : review.images
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

        logger.info('Review updated', {
            context: 'REVIEWS_API',
            metadata: { reviewId: id }
        })

        return NextResponse.json(updatedReview)
    } catch (error) {
        logger.error('Error updating review', error, { context: 'REVIEWS_API' })
        return NextResponse.json({ error: 'Error updating review' }, { status: 500 })
    }
}

// DELETE - Eliminar review
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const review = await prisma.review.findUnique({
            where: { id }
        })

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        // Solo el autor o admin puede eliminar
        if (review.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.review.delete({
            where: { id }
        })

        logger.info('Review deleted', {
            context: 'REVIEWS_API',
            metadata: { reviewId: id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Error deleting review', error, { context: 'REVIEWS_API' })
        return NextResponse.json({ error: 'Error deleting review' }, { status: 500 })
    }
}

// POST - Marcar review como útil
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const review = await prisma.review.update({
            where: { id },
            data: {
                helpfulCount: {
                    increment: 1
                }
            }
        })

        return NextResponse.json(review)
    } catch (error) {
        logger.error('Error marking review helpful', error, { context: 'REVIEWS_API' })
        return NextResponse.json({ error: 'Error updating review' }, { status: 500 })
    }
}
