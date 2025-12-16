'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
    Package, TrendingUp, DollarSign, Star, Search, Filter, Edit, Trash2, Plus,
    Eye, EyeOff, CheckCircle, AlertCircle, ArrowUpDown, Home, ExternalLink,
    ShoppingBag, Truck, CreditCard, Calendar, User, Shield
} from 'lucide-react'
import Loading from '@/components/shared/Loading'

type SortField = 'name' | 'price' | 'stock' | 'active'
type SortOrder = 'asc' | 'desc'
type Tab = 'products' | 'orders'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('products')

    // Data states
    const [products, setProducts] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('Todas')
    const [filterStatus, setFilterStatus] = useState('Todos')
    const [sortField, setSortField] = useState<SortField>('name')
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

    // UI States
    const [deleteProductConfirm, setDeleteProductConfirm] = useState<{ id: string; name: string } | null>(null)
    const [updateOrderModal, setUpdateOrderModal] = useState<any | null>(null)

    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/admin')
            return
        }
        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            toast.error('Acceso denegado: Se requieren permisos de administrador')
            router.push('/')
            return
        }
        if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetchData()
        }
    }, [status, session, router])

    useEffect(() => {
        filterProducts()
    }, [searchTerm, filterCategory, filterStatus, products, sortField, sortOrder])

    const fetchData = async () => {
        try {
            const [productsRes, ordersRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/orders')
            ])

            const productsData = await productsRes.json()
            const ordersData = await ordersRes.json()

            const productsArray = productsData.products || productsData || []
            const ordersArray = Array.isArray(ordersData) ? ordersData : []

            setProducts(productsArray)
            setFilteredProducts(productsArray)
            setOrders(ordersArray)

            // Calculate stats
            const totalRevenue = ordersArray
                .filter((o: any) => o.paymentStatus === 'completed' || o.paymentMethod === 'bitcoin')
                .reduce((sum: number, order: any) => sum + order.total, 0)

            setStats({
                totalProducts: productsArray.length,
                activeProducts: productsArray.filter((p: any) => p.active).length,
                totalOrders: ordersArray.length,
                totalRevenue
            })

        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Error al cargar datos del dashboard')
        } finally {
            setLoading(false)
        }
    }

    const filterProducts = () => {
        let filtered = [...products]
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (filterCategory !== 'Todas') filtered = filtered.filter(p => p.category === filterCategory)

        if (filterStatus === 'Activos') filtered = filtered.filter(p => p.active)
        else if (filterStatus === 'Inactivos') filtered = filtered.filter(p => !p.active)
        else if (filterStatus === 'Destacados') filtered = filtered.filter(p => p.featured)
        else if (filterStatus === 'Sin Stock') filtered = filtered.filter(p => p.stock === 0)

        filtered.sort((a, b) => {
            let aVal = a[sortField]
            let bVal = b[sortField]
            if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase() }
            if (sortOrder === 'asc') return aVal > bVal ? 1 : -1
            else return aVal < bVal ? 1 : -1
        })
        setFilteredProducts(filtered)
    }

    // --- Product Actions ---
    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Error')
            toast.success('Producto eliminado')
            setDeleteProductConfirm(null)
            fetchData()
        } catch (error) {
            toast.error('Error al eliminar producto')
        }
    }

    const toggleProductActive = async (id: string, current: boolean) => {
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !current })
            })
            toast.success(current ? 'Producto desactivado' : 'Producto activado')
            fetchData()
        } catch (error) { toast.error('Error al actualizar') }
    }

    const toggleProductFeatured = async (id: string, current: boolean) => {
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !current })
            })
            toast.success(current ? 'Removido de destacados' : 'Añadido a destacados')
            fetchData()
        } catch (error) { toast.error('Error al actualizar') }
    }

    // --- Order Actions ---
    const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
        try {
            await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            toast.success(`Orden actualizada a ${newStatus}`)
            setUpdateOrderModal(null)
            fetchData()
        } catch (error) { toast.error('Error al actualizar orden') }
    }

    if (loading) return <Loading />

    const categories = ['Todas', ...new Set(products.map((p: any) => p.category))]

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 pt-20">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-bold mb-4">
                            <Shield className="w-4 h-4" />
                            Panel de Administración
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Dashboard</h1>
                        <p className="text-slate-400">Bienvenido de nuevo, {session?.user?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 font-bold transition flex items-center gap-2"
                            >
                                <Home className="w-4 h-4" /> Ir a Tienda
                            </motion.button>
                        </Link>
                        <Link href="/admin/productos/nuevo">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 font-bold transition flex items-center gap-2 shadow-lg shadow-ind igo-500/30"
                            >
                                <Plus className="w-4 h-4" /> Nuevo Producto
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={DollarSign} label="Ingresos" value={`$${stats.totalRevenue.toLocaleString()}`} color="green" />
                    <StatCard icon={ShoppingBag} label="Órdenes" value={stats.totalOrders} color="blue" />
                    <StatCard icon={Package} label="Productos" value={stats.totalProducts} color="purple" />
                    <StatCard icon={Star} label="Activos" value={stats.activeProducts} color="yellow" />
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-800 mb-8">
                    <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} label="Productos" icon={Package} />
                    <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Órdenes" icon={ShoppingBag} />
                </div>

                {/* CONTENT */}
                <AnimatePresence mode="wait">
                    {activeTab === 'products' ? (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Product Filters */}
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2 relative">
                                    <Search className="absolute left-4 top-4 text-indigo-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                    value={filterCategory}
                                    onChange={e => setFilterCategory(e.target.value)}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                >
                                    <option value="Todos">Todos</option>
                                    <option value="Activos">Activos</option>
                                    <option value="Inactivos">Inactivos</option>
                                    <option value="Sin Stock">Sin Stock</option>
                                </select>
                            </div>

                            {/* Products Table */}
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-950/50 border-b border-slate-800">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Producto</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Estado</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Precio</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Stock</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {filteredProducts.map(product => (
                                                <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 relative overflow-hidden">
                                                                {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white">{product.name}</p>
                                                                <p className="text-xs text-slate-500">{product.category}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => toggleProductActive(product.id, product.active)}
                                                                className={`p-2 rounded-xl ${product.active ? 'text-green-400 bg-green-500/20 border border-green-500/30' : 'text-slate-500 bg-slate-800 border border-slate-700'}`}
                                                            >
                                                                {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => toggleProductFeatured(product.id, product.featured)}
                                                                className={`p-2 rounded-xl ${product.featured ? 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30' : 'text-slate-500 bg-slate-800 border border-slate-700'}`}
                                                            >
                                                                <Star className="w-4 h-4 fill-current" />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-white">${product.price}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${product.stock > 0 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                                            {product.stock} und.
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                        <Link href={`/admin/productos/${product.id}/editar`}>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl transition"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </motion.button>
                                                        </Link>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setDeleteProductConfirm(product)}
                                                            className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </motion.button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-950/50 border-b border-slate-800">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Orden ID</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Cliente</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Fecha</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Total</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Estado</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider">Pago</th>
                                                <th className="px-6 py-4 text-xs font-black text-indigo-400 uppercase tracking-wider text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {orders.map(order => (
                                                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{order.id.slice(-8).toUpperCase()}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-slate-500" />
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{order.shippingName}</p>
                                                                <p className="text-xs text-slate-500">{order.shippingEmail}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-400">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-white">${order.total.toFixed(2)}</td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-xs px-3 py-1.5 rounded-xl font-bold border ${order.paymentStatus === 'completed'
                                                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                            }`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setUpdateOrderModal(order)}
                                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-bold"
                                                        >
                                                            Gestionar
                                                        </motion.button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr><td colSpan={7} className="p-12 text-center text-slate-500">No hay órdenes registradas</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MODALS */}
                {deleteProductConfirm && (
                    <ConfirmModal
                        title="Eliminar producto"
                        message={`¿Eliminar "${deleteProductConfirm.name}"?`}
                        onConfirm={() => handleDeleteProduct(deleteProductConfirm.id)}
                        onCancel={() => setDeleteProductConfirm(null)}
                    />
                )}

                {updateOrderModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
                        >
                            <h3 className="text-2xl font-black text-white mb-6">Actualizar Orden #{updateOrderModal.id.slice(-8)}</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-slate-400 mb-4">Selecciona el nuevo estado del pedido:</p>
                                {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                                    <motion.button
                                        key={status}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleUpdateOrderStatus(updateOrderModal.id, status)}
                                        className={`w-full text-left px-5 py-4 rounded-xl border flex justify-between items-center transition font-bold ${updateOrderModal.status === status
                                            ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                                            : 'hover:bg-slate-800 border-slate-700 text-white'
                                            }`}
                                    >
                                        {status}
                                        {updateOrderModal.status === status && <CheckCircle className="w-5 h-5 text-indigo-400" />}
                                    </motion.button>
                                ))}
                            </div>
                            <button
                                onClick={() => setUpdateOrderModal(null)}
                                className="mt-6 w-full py-3 text-slate-400 hover:bg-slate-800 rounded-xl transition font-bold"
                            >
                                Cancelar
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        green: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400', icon: 'text-green-400' },
        blue: { bg: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400' },
        purple: { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'text-purple-400' },
        yellow: { bg: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: 'text-yellow-400' },
    }
    const style = colors[color]
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${style.bg} border ${style.border} backdrop-blur-xl p-6 rounded-2xl flex items-center justify-between hover:scale-105 transition-all shadow-xl`}
        >
            <div>
                <p className="text-slate-400 text-sm font-bold mb-1">{label}</p>
                <p className={`text-3xl font-black ${style.text}`}>{value}</p>
            </div>
            <div className={`p-4 rounded-xl bg-slate-900/50 border ${style.border}`}>
                <Icon className={`w-6 h-6 ${style.icon}`} />
            </div>
        </motion.div>
    )
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={`pb-4 px-4 flex items-center gap-2 font-black transition-all relative ${active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
            {active && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />}
        </button>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        PENDING: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        PAID: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        SHIPPED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        DELIVERED: 'bg-green-500/20 text-green-400 border-green-500/30',
        CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return (
        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${styles[status] || styles.PENDING}`}>
            {status}
        </span>
    )
}

function ConfirmModal({ title, message, onConfirm, onCancel }: any) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
            >
                <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{title}</h3>
                <p className="text-slate-400 mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 border border-slate-700 text-white rounded-xl hover:bg-slate-800 transition font-bold">Cancelar</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-500 hover:to-rose-500 transition font-bold shadow-lg shadow-red-500/30">Confirmar</button>
                </div>
            </motion.div>
        </div>
    )
}