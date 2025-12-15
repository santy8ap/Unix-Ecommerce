'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Filter,
    ArrowLeft,
    Package,
    Loader2
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminProductsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/')
            return
        }

        if (status === 'authenticated') {
            fetchProducts()
        }
    }, [status, session, router])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(products)
        } else {
            const lowerQuery = searchQuery.toLowerCase()
            setFilteredProducts(products.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            ))
        }
    }, [searchQuery, products])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=100') // Fetch enough for admin list
            const data = await res.json()
            setProducts(data.products || [])
            setFilteredProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Could not load products')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        const toastId = toast.loading('Deleting product...')
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')

            setProducts(prev => prev.filter(p => p.id !== id))
            toast.success('Product deleted successfully', { id: toastId })
        } catch (error) {
            console.error('Error deleting product:', error)
            toast.error('Error deleting product', { id: toastId })
        }
    }

    const getFirstImage = (images: string[] | string): string => {
        if (Array.isArray(images)) return images[0] || ''
        // Fallback for legacy data (should not happen after DB migration)
        if (typeof images === 'string') {
            try {
                const parsed = JSON.parse(images)
                return Array.isArray(parsed) ? parsed[0] : images
            } catch {
                return images
            }
        }
        return ''
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Products</h1>
                            <p className="text-slate-500">Manage your product catalog ({products.length} items)</p>
                        </div>
                        <Link
                            href="/admin/productos/nuevo"
                            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                </div>

                {/* Products List */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left py-5 px-8 font-bold text-xs text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left py-5 px-8 font-bold text-xs text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="text-left py-5 px-8 font-bold text-xs text-slate-500 uppercase tracking-wider">Price</th>
                                    <th className="text-left py-5 px-8 font-bold text-xs text-slate-500 uppercase tracking-wider">Stock</th>
                                    <th className="text-left py-5 px-8 font-bold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right py-5 px-8 font-bold text-xs text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200">
                                                        <Image
                                                            src={getFirstImage(product.images)}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{product.name}</div>
                                                        <div className="text-xs text-slate-500">ID: {product.id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-8">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-8 font-bold text-slate-900">
                                                ${product.price.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-8">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-slate-600'}`}>
                                                        {product.stock}
                                                    </span>
                                                    {product.stock < 10 && (
                                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-8">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                                                    ${product.active
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${product.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                    {product.active ? 'Active' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/productos/${product.id}/editar`}
                                                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Package className="w-12 h-12 mb-4 opacity-20" />
                                                <p className="text-lg font-medium text-slate-900">No products found</p>
                                                <p className="text-sm">Try adjusting your search or add a new product.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
