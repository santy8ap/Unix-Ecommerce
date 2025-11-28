'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/Skeletons'
import { Search, ChevronDown, X, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = ['Todas', 'Casual', 'Deportiva', 'Formal', 'Vintage', 'Estampada']
const COLORS = ['Todos', 'Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo']
const SIZES = ['Todas', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const SORT_OPTIONS = [
    { value: 'newest', label: 'Más Nuevos' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'popular', label: 'Más Populares' },
    { value: 'rating', label: 'Mejor Calificación' }
]

interface Product {
    id: string
    name: string
    price: number
    images: string[] | string
    category: string
    [key: string]: unknown
}

interface Filters {
    category: string
    color: string
    size: string
    search: string
    priceMin: number
    priceMax: number
    sort: string
}

export default function ProductsContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [activeFiltersCount, setActiveFiltersCount] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768)
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
    }, [filters])

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

            const response = await fetch(`/api/products?${params}`)
            if (!response.ok) throw new Error('Error al cargar productos')

            const data = await response.json()
            const productsList = data.products || (Array.isArray(data) ? data : [])
            setProducts(productsList)
        } catch (error) {
            console.error('Error fetching products:', error)
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
    }

    return (
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header with Active Filters */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between flex-wrap gap-4"
            >
                <div>
                    <p className="text-gray-600 font-medium">
                        Mostrando <span className="text-red-600 font-bold text-lg">{products.length}</span> productos
                    </p>
                </div>

                {activeFiltersCount > 0 && (
                    <motion.button
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        onClick={resetFilters}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                    >
                        <X className="w-4 h-4" />
                        Limpiar {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''}
                    </motion.button>
                )}
            </motion.div>

            {/* Filters Section */}
            <div className="mb-8">
                {/* Mobile Filter Toggle */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg px-4 py-3 flex items-center justify-between mb-4 hover:shadow-lg transition font-semibold"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        <span>Filtros</span>
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                    />
                </motion.button>

                {/* Filter Card */}
                <AnimatePresence>
                    {(showFilters || isDesktop) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 md:block"
                        >
                            {/* Search Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Buscar Productos
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ej: camiseta, suéter..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition hover:border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Filter Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Categoría
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition cursor-pointer hover:bg-gray-50"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Color Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Color
                                    </label>
                                    <select
                                        value={filters.color}
                                        onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition cursor-pointer hover:bg-gray-50"
                                    >
                                        {COLORS.map(color => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Size Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Talla
                                    </label>
                                    <select
                                        value={filters.size}
                                        onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition cursor-pointer hover:bg-gray-50"
                                    >
                                        {SIZES.map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Precio Máx: ${filters.priceMax}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={filters.priceMax}
                                        onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
                                        className="w-full accent-red-600"
                                    />
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Ordenar Por
                                    </label>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition cursor-pointer hover:bg-gray-50"
                                    >
                                        {SORT_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Products Grid */}
            {loading ? (
                <ProductGridSkeleton count={9} />
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center"
                >
                    <p className="text-red-700 font-semibold mb-4 text-lg">{error}</p>
                    <button
                        onClick={() => fetchProducts()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-semibold"
                    >
                        Intentar de Nuevo
                    </button>
                </motion.div>
            ) : products.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300"
                >
                    <div className="mb-4">
                        <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                        No se encontraron productos
                    </h3>
                    <p className="text-gray-600 mb-8">
                        Intenta con otros filtros o busca algo diferente
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetFilters}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg transition font-semibold shadow-lg"
                    >
                        Limpiar Todos los Filtros
                    </motion.button>
                </motion.div>
            )}
        </div>
    )
}
