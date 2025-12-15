/**
 * 🎨 Smart Closet - Panel de armario virtual con IA
 * Permite a los usuarios gestionar su colección de prendas
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    Heart,
    Search,
    Filter,
    Sparkles,
    ShoppingBag,
    Upload,
    X,
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import ImageUploadAnalyzer from './ImageUploadAnalyzer'

interface ClosetItem {
    id: string
    name: string
    category: string
    color: string
    colors?: string[]
    image?: string
    brand?: string
    size?: string
    price?: number
    source: 'user' | 'store' | 'gift'
    favorite: boolean
    timesWorn: number
    notes?: string
    createdAt: string
}

const CATEGORIES = [
    { value: '', label: 'Todas', icon: '👕' },
    { value: 'shirt', label: 'Camisas', icon: '👔' },
    { value: 'pants', label: 'Pantalones', icon: '👖' },
    { value: 'dress', label: 'Vestidos', icon: '👗' },
    { value: 'shoes', label: 'Zapatos', icon: '👟' },
    { value: 'jacket', label: 'Chaquetas', icon: '🧥' },
    { value: 'accessories', label: 'Accesorios', icon: '👜' },
]

export default function SmartCloset() {
    const [items, setItems] = useState<ClosetItem[]>([])
    const [filteredItems, setFilteredItems] = useState<ClosetItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        fetchCloset()
    }, [])

    useEffect(() => {
        filterItems()
    }, [items, selectedCategory, searchQuery, showFavoritesOnly])

    const fetchCloset = async () => {
        try {
            const response = await fetch('/api/closet')
            if (response.ok) {
                const data = await response.json()
                setItems(data.items || [])
            }
        } catch (error) {
            console.error('Error fetching closet:', error)
            toast.error('Error cargando tu closet')
        } finally {
            setIsLoading(false)
        }
    }

    const filterItems = () => {
        let filtered = [...items]

        if (selectedCategory) {
            filtered = filtered.filter((item) => item.category === selectedCategory)
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (showFavoritesOnly) {
            filtered = filtered.filter((item) => item.favorite)
        }

        setFilteredItems(filtered)
    }

    const toggleFavorite = async (itemId: string, currentFavorite: boolean) => {
        try {
            const response = await fetch('/api/closet', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: itemId, favorite: !currentFavorite }),
            })

            if (response.ok) {
                setItems(
                    items.map((item) =>
                        item.id === itemId ? { ...item, favorite: !currentFavorite } : item
                    )
                )
                toast.success(currentFavorite ? 'Quitado de favoritos' : 'Agregado a favoritos')
            }
        } catch (error) {
            toast.error('Error actualizando favorito')
        }
    }

    const deleteItem = async (itemId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta prenda?')) return

        try {
            const response = await fetch(`/api/closet/${itemId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setItems(items.filter((item) => item.id !== itemId))
                toast.success('Prenda eliminada')
            }
        } catch (error) {
            toast.error('Error eliminando prenda')
        }
    }

    const getCategoryIcon = (category: string) => {
        const cat = CATEGORIES.find((c) => c.value === category)
        return cat?.icon || '👕'
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 md:px-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Premium Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-bold mb-4">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                Smart Closet IA
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                                    Mi Guardarropa
                                </span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-2xl">
                                Gestiona tu colección y crea outfits increíbles con inteligencia artificial
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Prendas', value: items.length, icon: ShoppingBag, color: 'indigo' },
                        { label: 'Favoritos', value: items.filter((i) => i.favorite).length, icon: Heart, color: 'pink' },
                        { label: 'De Tienda', value: items.filter((i) => i.source === 'store').length, icon: ShoppingBag, color: 'purple' },
                        { label: 'Propias', value: items.filter((i) => i.source === 'user').length, icon: Upload, color: 'violet' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/10"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 border border-${stat.color}-500/30 flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                            </div>
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Search & Controls Bar */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o marca..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>

                        {/* Add button */}
                        <motion.button
                            onClick={() => setShowAddModal(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar Prenda
                        </motion.button>
                    </div>

                    {/* Category filters */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {CATEGORIES.map((cat) => (
                            <motion.button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap font-bold ${selectedCategory === cat.value
                                    ? 'border-indigo-500/50 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
                                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                                    }`}
                            >
                                <span className="mr-2">{cat.icon}</span>
                                {cat.label}
                            </motion.button>
                        ))}
                        <motion.button
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap font-bold ${showFavoritesOnly
                                ? 'border-pink-500/50 bg-gradient-to-r from-pink-600/20 to-rose-600/20 text-pink-300 shadow-lg shadow-pink-500/20'
                                : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                                }`}
                        >
                            <Heart className={`w-4 h-4 inline mr-2 ${showFavoritesOnly ? 'fill-pink-400' : ''}`} />
                            Favoritos
                        </motion.button>
                    </div>
                </div>

                {/* Items grid */}
                {isLoading ? (
                    <div className="text-center py-32">
                        <div className="inline-block w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="mt-6 text-slate-400 text-lg">Cargando tu closet...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-slate-900/40 backdrop-blur-sm border-2 border-dashed border-slate-700 rounded-3xl"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-indigo-400" />
                        </div>
                        <h3 className="text-3xl font-black mb-3 text-white">Tu closet está vacío</h3>
                        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">Comienza agregando tus prendas favoritas y crea outfits increíbles</p>
                        <motion.button
                            onClick={() => setShowAddModal(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all inline-flex items-center gap-2 shadow-lg shadow-indigo-500/30"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar Primera Prenda
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredItems.map((item) => (
                            <ClosetItemCard
                                key={item.id}
                                item={item}
                                onToggleFavorite={toggleFavorite}
                                onDelete={deleteItem}
                            />
                        ))}
                    </div>
                )}

                {/* Add Modal */}
                <AddItemModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        fetchCloset()
                        setShowAddModal(false)
                    }}
                />
            </div>
        </div>
    )
}

// Item Card Component
function ClosetItemCard({
    item,
    onToggleFavorite,
    onDelete,
}: {
    item: ClosetItem
    onToggleFavorite: (id: string, current: boolean) => void
    onDelete: (id: string) => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden group hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900">
                {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl opacity-30">
                        {item.category === 'shirt' && '👕'}
                        {item.category === 'pants' && '👖'}
                        {item.category === 'dress' && '👗'}
                        {item.category === 'shoes' && '👟'}
                        {item.category === 'jacket' && '🧥'}
                        {item.category === 'accessories' && '👜'}
                        {!['shirt', 'pants', 'dress', 'shoes', 'jacket', 'accessories'].includes(item.category) && '👕'}
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Favorite button */}
                <motion.button
                    onClick={() => onToggleFavorite(item.id, item.favorite)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:border-pink-500/50 transition-all shadow-lg"
                >
                    <Heart className={`w-4 h-4 ${item.favorite ? 'fill-pink-500 text-pink-500' : 'text-slate-400'}`} />
                </motion.button>

                {/* Source badge */}
                {item.source === 'store' && (
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-indigo-500/20 backdrop-blur-md text-xs font-bold text-indigo-300 border border-indigo-500/30 shadow-lg">
                        <ShoppingBag className="w-3 h-3 inline mr-1" />
                        Tienda
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-5">
                <h3 className="font-black text-white mb-1.5 truncate text-lg">{item.name}</h3>
                <p className="text-sm text-slate-400 mb-3 font-medium">{item.brand || 'Sin marca'}</p>
                <div className="flex items-center gap-2 mb-4">
                    <div
                        className="w-7 h-7 rounded-lg border-2 border-slate-700 shadow-inner"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-500 capitalize font-semibold">{item.color}</span>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="flex gap-2"
                >
                    <button
                        onClick={() => onDelete(item.id)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-sm flex items-center justify-center gap-2 font-bold"
                    >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}

// Add Item Modal with AI Scanner
function AddItemModal({
    isOpen,
    onClose,
    onSuccess,
}: {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}) {
    const [useAIScan, setUseAIScan] = useState(true)
    const [scannedData, setScannedData] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)

    if (!isOpen) return null

    const handleAIAnalysis = (data: any) => {
        setScannedData(data)
    }

    const saveItem = async () => {
        if (!scannedData) {
            toast.error('Primero escanea una prenda')
            return
        }

        setIsSaving(true)

        try {
            const response = await fetch('/api/closet/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: scannedData.description || `${scannedData.color} ${scannedData.category}`,
                    category: scannedData.category || 'shirt',
                    color: scannedData.color || 'unknown',
                    colors: scannedData.colors || [scannedData.color],
                    brand: scannedData.brand || null,
                    source: 'user',
                }),
            })

            if (response.ok) {
                toast.success('¡Prenda agregada!')
                setScannedData(null)
                setUseAIScan(true)
                onSuccess()
            } else {
                throw new Error('Error guardando')
            }
        } catch (error) {
            toast.error('Error agregando prenda')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-3xl w-full my-8 shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Agregar Prenda</h2>
                        <p className="text-sm text-slate-500 mt-1">Escanea con IA o ingresa manualmente</p>
                    </div>
                    <button
                        onClick={() => {
                            setScannedData(null)
                            setUseAIScan(true)
                            onClose()
                        }}
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setUseAIScan(true)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all font-semibold ${useAIScan
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                    >
                        <Sparkles className="w-5 h-5 inline mr-2" />
                        Escanear con IA
                    </button>
                    <button
                        onClick={() => setUseAIScan(false)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all font-semibold ${!useAIScan
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                            }`}
                    >
                        Manual
                    </button>
                </div>

                {/* Content */}
                {useAIScan ? (
                    <div>
                        <ImageUploadAnalyzer
                            analysisType="clothing"
                            onAnalysisComplete={handleAIAnalysis}
                            title="Escanea tu Prenda"
                            description="Toma una foto clara de la prenda sobre fondo claro"
                        />

                        {scannedData && (
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={saveItem}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 rounded-xl bg-primary text-slate-900 font-bold hover:bg-primary/80 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar en Closet'}
                                </button>
                                <button
                                    onClick={() => setScannedData(null)}
                                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                                >
                                    Escanear Otra
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500">Formulario manual próximamente...</p>
                        <p className="text-sm text-slate-400 mt-2">
                            Por ahora usa el escáner IA para mejores resultados
                        </p>
                        <button
                            onClick={() => setUseAIScan(true)}
                            className="mt-4 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
                        >
                            <Sparkles className="w-5 h-5 inline mr-2" />
                            Usar Escáner IA
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
