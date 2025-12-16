'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product } from '@/types'
import { Eye } from 'lucide-react'
import { logger } from '@/lib/services/logger'
import { parseJSON } from '@/lib/utils'

const MAX_RECENT_PRODUCTS = 8

export default function RecentlyViewedProducts() {
    const [recentProducts, setRecentProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadRecentProducts = async () => {
            try {
                const viewedIds = localStorage.getItem('recentlyViewed')
                if (!viewedIds) {
                    setLoading(false)
                    return
                }

                const ids = JSON.parse(viewedIds) as string[]
                if (ids.length === 0) {
                    setLoading(false)
                    return
                }

                // Fetch products data
                const promises = ids.slice(0, MAX_RECENT_PRODUCTS).map(id =>
                    fetch(`/api/products/${id}`).then(res => res.json())
                )

                const products = await Promise.all(promises)
                setRecentProducts(products.filter(p => p && !p.error))

                logger.info('Productos recientes cargados', {
                    context: 'RECENTLY_VIEWED',
                    metadata: { count: products.length }
                })
            } catch (error) {
                logger.error('Error cargando productos recientes', error, { context: 'RECENTLY_VIEWED' })
            } finally {
                setLoading(false)
            }
        }

        loadRecentProducts()
    }, [])

    if (loading || recentProducts.length === 0) {
        return null
    }

    return (
        <section className="py-16 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Eye className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white">
                                Vistos Recientemente
                            </h2>
                        </div>
                        <p className="text-slate-400">
                            Continúa explorando los productos que te interesaron
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('recentlyViewed')
                            setRecentProducts([])
                        }}
                        className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
                    >
                        Limpiar historial
                    </button>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {recentProducts.map((product, idx) => {
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
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <ProductCard product={parsedProduct} />
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

// Helper function to track viewed products
export function trackProductView(productId: string) {
    try {
        const viewedIds = localStorage.getItem('recentlyViewed')
        let ids: string[] = viewedIds ? JSON.parse(viewedIds) : []

        // Remove if already exists (to move to front)
        ids = ids.filter(id => id !== productId)

        // Add to front
        ids.unshift(productId)

        // Keep only last MAX_RECENT_PRODUCTS
        ids = ids.slice(0, MAX_RECENT_PRODUCTS)

        localStorage.setItem('recentlyViewed', JSON.stringify(ids))
    } catch (error) {
        logger.error('Error al rastrear producto visto', error, {
            context: 'RECENTLY_VIEWED',
            metadata: { productId }
        })
    }
}
