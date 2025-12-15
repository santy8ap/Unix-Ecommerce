'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp, Clock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { logger } from '@/lib/logger'

interface SearchResult {
    id: string
    name: string
    price: number
    images: string
    category: string
}

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searchHistory, setSearchHistory] = useState<string[]>([])
    const [trending, setTrending] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            // Load search history
            const history = localStorage.getItem('searchHistory')
            if (history) {
                try {
                    setSearchHistory(JSON.parse(history))
                } catch (error) {
                    logger.warn('Error parsing search history', { context: 'SEARCH' })
                }
            }
            // Mock trending
            setTrending(['T-Shirts', 'Hoodies', 'Vintage', 'Accessories'])

            // Focus input
            setTimeout(() => inputRef.current?.focus(), 100)

            // Prevent body scroll
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([])
            return
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`)
                const data = await res.json()
                setResults(data.products || [])

                logger.info('Búsqueda realizada', {
                    context: 'SEARCH',
                    metadata: { query, resultsCount: data.products?.length || 0 }
                })
            } catch (error) {
                logger.error('Error en búsqueda', error, {
                    context: 'SEARCH',
                    metadata: { query }
                })
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(searchTimeout)
    }, [query])

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return

        const history = [searchQuery, ...searchHistory.filter((h) => h !== searchQuery)].slice(0, 10)
        setSearchHistory(history)
        localStorage.setItem('searchHistory', JSON.stringify(history))

        router.push(`/productos?search=${encodeURIComponent(searchQuery)}`)
        onClose()
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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 max-w-5xl mx-auto w-full">
                        <div className="flex-1 relative">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                placeholder="Search for products..."
                                className="w-full bg-transparent border-none text-2xl font-bold text-white placeholder-slate-500 focus:ring-0 pl-10 pr-4"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-5xl mx-auto w-full">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Results</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {results.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/productos/${product.id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all group"
                                            >
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-700 relative flex-shrink-0">
                                                    <Image
                                                        src={getFirstImage(product.images)}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-white truncate group-hover:text-red-400 transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-400">{product.category}</p>
                                                    <p className="text-sm font-bold text-white mt-1">
                                                        ${product.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleSearch(query)}
                                        className="w-full py-4 text-center text-slate-400 hover:text-white font-bold transition-colors border-t border-slate-800 mt-4"
                                    >
                                        View all results for "{query}"
                                    </button>
                                </div>
                            ) : query.trim().length < 2 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Recent Searches */}
                                    {searchHistory.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Recent Searches
                                                </h3>
                                                <button
                                                    onClick={clearHistory}
                                                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                                                >
                                                    Clear History
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {searchHistory.slice(0, 5).map((term, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSearch(term)}
                                                        className="flex items-center justify-between w-full p-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all group text-left"
                                                    >
                                                        <span>{term}</span>
                                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trending */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                            <TrendingUp className="w-4 h-4" />
                                            Trending Now
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {trending.map((term, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSearch(term)}
                                                    className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-sm font-medium"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-xl text-slate-400 font-medium">
                                        No results found for "{query}"
                                    </p>
                                    <p className="text-slate-600 mt-2">
                                        Try checking your spelling or use different keywords.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
