import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        // Get total revenue
        const orders = await prisma.order.findMany({
            where: { status: { not: 'CANCELLED' } },
        })
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

        // Get total orders count
        const totalOrders = orders.length

        // Get total customers
        const totalCustomers = await prisma.user.count({
            where: { role: 'USER' },
        })

        // Get low stock products (stock < 10)
        const lowStockProducts = await prisma.product.count({
            where: {
                stock: { lt: 10 },
                active: true,
            },
        })

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        // Get top products (by order count)
        const topProducts = await prisma.product.findMany({
            take: 5,
            where: { active: true },
            include: {
                orderItems: {
                    select: {
                        quantity: true,
                    },
                },
            },
        })

        const topProductsWithSales = topProducts
            .map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                images: product.images,
                totalSold: product.orderItems.reduce((sum, item) => sum + item.quantity, 0),
            }))
            .sort((a, b) => b.totalSold - a.totalSold)

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            lowStockProducts,
            recentOrders,
            topProducts: topProductsWithSales,
        })
    } catch (error) {
        console.error('Dashboard error:', error)
        return NextResponse.json({ error: 'Error al cargar datos' }, { status: 500 })
    }
}
