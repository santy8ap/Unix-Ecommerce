import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'
import { Product } from '@/types'

export const dynamic = 'force-dynamic' // Ensure fresh data on every request, or remove for static generation (preferred for featured)
// For 'featured' products, we might want ISR. Let's stick to default caching or revalidate.
export const revalidate = 3600 // Revalidate every hour

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        active: true
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Serialize for Client Component
    return products.map(p => ({
      ...p,
      price: Number(p.price),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    })) as unknown as Product[]
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return <HomeClient featuredProducts={featuredProducts} />
}
