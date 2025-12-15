'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    name: string
    price: number
    images: string
    category: string
}

export default function AdvancedSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [searchHistory, setSearchHistory] = useState<string[]>([])
    const [trending, setTrending] = useState<string[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        // Load search history
        const history = localStorage.getItem('searchHistory')
        if (history) {
            setSearchHistory(JSON.parse(history))
        }

        // Load trending searches (mock data for now)
        setTrending(['Camisetas', 'Hoodies', 'Gorras', 'Estampados personalizados'])

        // Click outside to close
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([])
            return
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
                const data = await res.json()
                setResults(data.products || [])
                setShowResults(true)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(searchTimeout)
    }, [query])

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return

        // Add to history
        const history = [searchQuery, ...searchHistory.filter((h) => h !== searchQuery)].slice(0, 10)
        setSearchHistory(history)
        localStorage.setItem('searchHistory', JSON.stringify(history))

        // Navigate to products page with search
        router.push(`/productos?search=${encodeURIComponent(searchQuery)}`)
        setShowResults(false)
        setQuery('')
    }

    const clearHistory = () => {
        setSearchHistory([])
        localStorage.removeItem('searchHistory')
    }

    const getFirstImage = (images: string): string => {
        try {
            const parsed = JSON.parse(images)
            return Array.isArray(parsed) ? parsed[0] : images
        } catch {
            return images
        }
    }

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(query)
                        }
                    }}
                    placeholder="Buscar productos..."
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('')
                            setResults([])
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
                    >
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
                            </div>
                        ) : results.length > 0 ? (
                            <div>
                                <div className="p-2 border-b border-gray-100 bg-gray-50">
                                    <p className="text-xs font-semibold text-gray-500 px-2">
                                        RESULTADOS
                                    </p>
                                </div>
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/productos/${product.id}`}
                                        onClick={() => {
                                            handleSearch(query)
                                        }}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                                    >
                                        <img
                                            src={getFirstImage(product.images)}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {product.category}
                                            </p>
                                        </div>
                                        <p className="font-bold text-red-600">
                                            ${product.price.toFixed(2)}
                                        </p>
                                    </Link>
                                ))}
                                <button
                                    onClick={() => handleSearch(query)}
                                    className="w-full p-3 text-center text-red-600 hover:bg-gray-50 font-semibold transition border-t border-gray-100"
                                >
                                    Ver todos los resultados
                                </button>
                            </div>
                        ) : query.trim().length < 2 ? (
                            <div className="p-4">
                                {/* Search History */}
                                {searchHistory.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                RECIENTES
                                            </div>
                                            <button
                                                onClick={clearHistory}
                                                className="text-xs text-gray-500 hover:text-red-600 transition"
                                            >
                                                Limpiar
                                            </button>
                                        </div>
                                        {searchHistory.slice(0, 5).map((term, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSearch(term)}
                                                className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Trending */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <TrendingUp className="w-4 h-4" />
                                        TENDENCIAS
                                    </div>
                                    {trending.map((term, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSearch(term)}
                                            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No se encontraron resultados para "{query}"
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
