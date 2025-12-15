import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')

        const where: any = { published: true }
        if (category) where.category = category

        const posts = await prisma.blogPost.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                author: true,
                category: true,
                views: true,
                publishedAt: true,
            },
        })

        return NextResponse.json({ posts })
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return NextResponse.json({ posts: [] }, { status: 500 })
    }
}
