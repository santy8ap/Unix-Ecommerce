'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product } from '@/types'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { parseJSON } from '@/lib/utils'

interface RelatedProductsProps {
    productId: string
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRelatedProducts()
    }, [productId])

    const fetchRelatedProducts = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/related`)
            const data = await res.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching related products:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="py-16">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-800 rounded w-1/4 mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-slate-800 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <section className="py-16 border-t border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-3xl font-black text-white">
                            También te puede gustar
                        </h2>
                    </div>
                    <p className="text-slate-400">
                        Productos similares seleccionados para ti
                    </p>
                </div>

                <Link
                    href="/productos"
                    className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                    Ver todo
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, idx) => {
                    const parsedProduct = {
                        ...product,
                        images: parseJSON(product.images, []),
                        sizes: parseJSON(product.sizes, []),
                        colors: parseJSON(product.colors, [])
                    }
                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <ProductCard product={parsedProduct} />
                        </motion.div>
                    )
                })}
            </div>

            {/* Mobile View All */}
            <div className="mt-8 md:hidden">
                <Link
                    href="/productos"
                    className="block w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                    Ver Todos los Productos
                </Link>
            </div>
        </section>
    )
}
