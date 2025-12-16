'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Info } from 'lucide-react'
import ProductForm from '@/components/products/ProductForm'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { toast } from 'sonner'

export default function EditProductPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/')
            return
        }

        if (status === 'authenticated' && params.id) {
            fetchProduct()
        }
    }, [status, session, params.id, router])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            if (!response.ok) throw new Error('Error loading product')
            const data = await response.json()
            setProduct(data)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Could not load product')
            router.push('/admin')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            </div>
        )
    }

    if (!product) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Product</h1>
                            <p className="text-slate-500">Update product details and inventory.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8"
                        >
                            <ProductForm product={product} isEdit={true} />
                        </motion.div>
                    </div>

                    {/* Sidebar / Help */}
                    <div className="space-y-6">
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-amber-900 text-sm mb-1">Editing Tips</h3>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Changes to price will affect future orders only.
                                        You can deactivate a product instead of deleting it to keep sales history.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 text-sm mb-4">Product Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Last Updated</span>
                                    <span className="font-medium text-slate-900">
                                        {new Date(product.updatedAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Total Sales</span>
                                    <span className="font-medium text-slate-900">
                                        {product.orderItems?.length || 0} units
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
