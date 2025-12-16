'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
    TrendingUp,
    Package,
    Users,
    DollarSign,
    ShoppingCart,
    AlertCircle,
    BarChart3,
    ArrowRight,
    Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        lowStockProducts: 0,
        recentOrders: [],
        topProducts: [],
        revenueByMonth: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        } else if (session?.user && (session.user as any).role !== 'ADMIN') {
            router.push('/')
        } else if (session) {
            fetchDashboardData()
        }
    }, [session, status, router])

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard')
            const data = await res.json()
            setStats(data)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            change: '+12.5%',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            change: '+8.2%',
        },
        {
            title: 'Active Customers',
            value: stats.totalCustomers,
            icon: Users,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            change: '+15.3%',
        },
        {
            title: 'Low Stock Items',
            value: stats.lowStockProducts,
            icon: AlertCircle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            change: stats.lowStockProducts > 0 ? 'Action needed' : 'Optimal',
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                        <p className="text-slate-500">
                            Welcome back, {session?.user?.name}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/admin/productos/nuevo"
                            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, idx) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                            <Link href="/admin/pedidos" className="text-sm font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-4 px-8 font-semibold text-xs text-slate-500 uppercase tracking-wider">Order ID</th>
                                        <th className="text-left py-4 px-8 font-semibold text-xs text-slate-500 uppercase tracking-wider">Customer</th>
                                        <th className="text-left py-4 px-8 font-semibold text-xs text-slate-500 uppercase tracking-wider">Total</th>
                                        <th className="text-left py-4 px-8 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-4 px-8 font-semibold text-xs text-slate-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                        stats.recentOrders.slice(0, 5).map((order: any) => (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-8 font-mono text-sm text-slate-600">#{order.id.slice(0, 8)}</td>
                                                <td className="py-4 px-8 text-sm text-slate-900 font-medium">{order.shippingName}</td>
                                                <td className="py-4 px-8 text-sm text-slate-900 font-bold">${order.total.toFixed(2)}</td>
                                                <td className="py-4 px-8">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                                            order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-slate-100 text-slate-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-8 text-sm text-slate-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-500">
                                                No recent orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                            <div className="space-y-4">
                                <Link
                                    href="/admin/productos/nuevo"
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Plus className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Add Product</h3>
                                        <p className="text-xs text-slate-500">Create a new listing</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/admin/productos"
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Package className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Manage Products</h3>
                                        <p className="text-xs text-slate-500">Edit or delete items</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/admin/pedidos"
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <ShoppingCart className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Manage Orders</h3>
                                        <p className="text-xs text-slate-500">Process and ship</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/admin/reportes"
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <BarChart3 className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Analytics</h3>
                                        <p className="text-xs text-slate-500">View performance</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-slate-900 rounded-3xl shadow-lg shadow-slate-900/20 p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-2">System Status</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-slate-300 text-sm">All systems operational</span>
                                </div>
                                <p className="text-xs text-slate-400">Last backup: 2 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
