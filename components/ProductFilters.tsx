/**
 * Product Filters Component
 * Advanced filtering controls for products
 */

'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductFiltersProps {
    onFilterChange: (filters: FilterState) => void
    availableCategories?: string[]
    availableColors?: string[]
    availableSizes?: string[]
}

export interface FilterState {
    search: string
    category: string
    color: string
    size: string
    minPrice: string
    maxPrice: string
    sortBy: string
    sortOrder: string
}

export default function ProductFilters({
    onFilterChange,
    availableCategories = [],
    availableColors = [],
    availableSizes = [],
}: ProductFiltersProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: 'Todas',
        color: 'Todos',
        size: 'Todas',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    })

    const [searchDebounce, setSearchDebounce] = useState('')

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchDebounce }))
        }, 500)

        return () => clearTimeout(timer)
    }, [searchDebounce])

    // Notify parent of filter changes
    useEffect(() => {
        onFilterChange(filters)
    }, [filters, onFilterChange])

    const handleReset = () => {
        const resetFilters: FilterState = {
            search: '',
            category: 'Todas',
            color: 'Todos',
            size: 'Todas',
            minPrice: '',
            maxPrice: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        }
        setFilters(resetFilters)
        setSearchDebounce('')
    }

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (key === 'sortBy' || key === 'sortOrder') return false
        if (key === 'search') return value.length > 0
        if (key === 'category' || key === 'color' || key === 'size') return value !== 'Todas' && value !== 'Todos'
        return value.length > 0
    }).length

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-red-600" />
                    Filtros y Búsqueda
                    {activeFilterCount > 0 && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </h3>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-gray-600 hover:text-gray-900 transition"
                >
                    {showFilters ? 'Ocultar' : 'Mostrar'}
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchDebounce}
                    onChange={(e) => setSearchDebounce(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                {searchDebounce && (
                    <button
                        onClick={() => setSearchDebounce('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Filters */}
            <AnimatePresence>
                {(showFilters || window.innerWidth >= 1024) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4"
                    >
                        {/* Sort By */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ordenar por
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="createdAt">Más reciente</option>
                                    <option value="price">Precio</option>
                                    <option value="name">Nombre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Orden
                                </label>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="desc">Descendente</option>
                                    <option value="asc">Ascendente</option>
                                </select>
                            </div>
                        </div>

                        {/* Category, Color, Size */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {availableCategories.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Categoría
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="Todas">Todas</option>
                                        {availableCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {availableColors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Color
                                    </label>
                                    <select
                                        value={filters.color}
                                        onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="Todos">Todos</option>
                                        {availableColors.map(color => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {availableSizes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Talla
                                    </label>
                                    <select
                                        value={filters.size}
                                        onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="Todas">Todas</option>
                                        {availableSizes.map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Price Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Precio mínimo
                                </label>
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    placeholder="$0"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Precio máximo
                                </label>
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    placeholder="$999"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Reset Button */}
                        {activeFilterCount > 0 && (
                            <motion.button
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleReset}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Limpiar Filtros
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
