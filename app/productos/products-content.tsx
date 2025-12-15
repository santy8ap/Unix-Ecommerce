'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/Skeletons'
import { Search, ChevronDown, X, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { logger } from '@/lib/logger'
import { Product } from '@/types'
import { parseJSON } from '@/lib/utils'

const CATEGORIES = ['Todas', 'Casual', 'Deportiva', 'Formal', 'Vintage', 'Estampada']
const COLORS = ['Todos', 'Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo']
const SIZES = ['Todas', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const SORT_OPTIONS = [
    { value: 'newest', label: '✨ Más Nuevos' },
    { value: 'price-low', label: '💰 Precio: Menor a Mayor' },
    { value: 'price-high', label: '💎 Precio: Mayor a Menor' },
    { value: 'popular', label: '🔥 Más Populares' },
    { value: 'rating', label: '⭐ Mejor Calificación' }
]

interface Filters {
    category: string
    color: string
    size: string
    search: string
    priceMin: number
    priceMax: number
    sort: string
}

interface PaginationData {
    page: number
    totalPages: number
    total: number
    hasMore: boolean
}

export default function ProductsContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [activeFiltersCount, setActiveFiltersCount] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        totalPages: 1,
        total: 0,
        hasMore: false
    })

    // Handle scroll for "Back to Top" button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024)
            if (window.innerWidth >= 1024) setShowFilters(true)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const [filters, setFilters] = useState<Filters>({
        category: searchParams.get('category') || 'Todas',
        color: 'Todos',
        size: 'Todas',
        search: '',
        priceMin: 0,
        priceMax: 1000,
        sort: 'newest'
    })

    // Calcular filtros activos
    useEffect(() => {
        let count = 0
        if (filters.category !== 'Todas') count++
        if (filters.color !== 'Todos') count++
        if (filters.size !== 'Todas') count++
        if (filters.search) count++
        if (filters.priceMin > 0 || filters.priceMax < 1000) count++
        setActiveFiltersCount(count)
    }, [filters])

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, pagination.page])

    const fetchProducts = async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()

            if (filters.category !== 'Todas') params.append('category', filters.category)
            if (filters.color !== 'Todos') params.append('color', filters.color)
            if (filters.size !== 'Todas') params.append('size', filters.size)
            if (filters.search) params.append('search', filters.search)
            params.append('sort', filters.sort)
            params.append('page', pagination.page.toString())
            params.append('limit', '12')

            const response = await fetch(`/api/products?${params}`)
            if (!response.ok) throw new Error('Error al cargar productos')

            const data = await response.json()
            const productsList = data.products || (Array.isArray(data) ? data : [])
            setProducts(productsList)

            if (data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    totalPages: data.pagination.totalPages,
                    total: data.pagination.total,
                    hasMore: data.pagination.hasMore
                }))
            }

            logger.info('Productos cargados', {
                context: 'PRODUCTS',
                metadata: { count: productsList.length, page: pagination.page }
            })
        } catch (error) {
            logger.error('Error cargando productos', error, { context: 'PRODUCTS' })
            setError('No se pudieron cargar los productos. Intenta más tarde.')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const resetFilters = () => {
        setFilters({
            category: 'Todas',
            color: 'Todos',
            size: 'Todas',
            search: '',
            priceMin: 0,
            priceMax: 1000,
            sort: 'newest'
        })
        setPagination(prev => ({ ...prev, page: 1 }))
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }))
        scrollToTop()
    }

    return (
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full relative z-10">
            {/* Controls Bar */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-30 shadow-2xl shadow-black/20">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                    {filters.search && (
                        <button
                            onClick={() => setFilters({ ...filters, search: '' })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${showFilters
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                            }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        <span className="hidden md:inline">Filtros</span>
                        {activeFiltersCount > 0 && (
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Sort */}
                    <div className="relative flex-1 md:flex-none">
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            className="w-full appearance-none px-6 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <AnimatePresence>
                    {(showFilters) && (
                        <motion.aside
                            initial={{ opacity: 0, height: 0, width: isDesktop ? 0 : '100%' }}
                            animate={{ opacity: 1, height: 'auto', width: isDesktop ? 280 : '100%' }}
                            exit={{ opacity: 0, height: 0, width: isDesktop ? 0 : '100%' }}
                            className="lg:flex-shrink-0 overflow-hidden"
                        >
                            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-8 sticky top-48 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-xl text-white flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-indigo-500" />
                                        Filtros
                                    </h3>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={resetFilters}
                                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Limpiar todo
                                        </button>
                                    )}
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="text-sm font-bold text-white mb-3 block">Categoría</label>
                                    <div className="space-y-2">
                                        {CATEGORIES.map(cat => (
                                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filters.category === cat
                                                    ? 'bg-indigo-600 border-indigo-600'
                                                    : 'border-slate-600 group-hover:border-indigo-500'
                                                    }`}>
                                                    {filters.category === cat && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={cat}
                                                    checked={filters.category === cat}
                                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                                    className="hidden"
                                                />
                                                <span className={`text-sm font-medium transition-colors ${filters.category === cat ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                                                    }`}>
                                                    {cat}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div>
                                    <label className="text-sm font-bold text-white mb-3 block">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {COLORS.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setFilters({ ...filters, color })}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filters.color === color
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg'
                                                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-bold text-white">Precio Máximo</label>
                                        <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">${filters.priceMax}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        step="10"
                                        value={filters.priceMax}
                                        onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
                                        className="w-full accent-indigo-600 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Products Grid */}
                <div className="flex-1">
                    {loading ? (
                        <ProductGridSkeleton count={12} />
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-12 text-center backdrop-blur-sm"
                        >
                            <p className="text-red-300 font-bold mb-4 text-lg">{error}</p>
                            <button
                                onClick={() => fetchProducts()}
                                className="btn-primary"
                            >
                                Intentar de Nuevo
                            </button>
                        </motion.div>
                    ) : products.length > 0 ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {/* Results count */}
                                <div className="mb-6 flex items-center justify-between">
                                    <p className="text-slate-400 text-sm">
                                        Mostrando <span className="text-white font-bold">{products.length}</span> de{' '}
                                        <span className="text-white font-bold">{pagination.total}</span> productos
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <ProductCard product={parsedProduct} />
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </motion.div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-12 flex items-center justify-center gap-2"
                                >
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-12 h-12 rounded-xl font-bold transition-all ${pagination.page === page
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={!pagination.hasMore}
                                        className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-16 text-center shadow-2xl"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Search className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">
                                No se encontraron productos
                            </h3>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Intenta ajustar tus filtros o busca algo diferente. ¡Tenemos muchas opciones para ti!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetFilters}
                                className="btn-primary"
                            >
                                Limpiar Filtros
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-110"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Volver arriba"
                    >
                        <ArrowUp className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}
