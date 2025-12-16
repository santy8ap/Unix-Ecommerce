/**
 * 🤖 Outfit Generator - Generador de outfits con IA Gemini
 * Componente principal para crear outfits personalizados
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles,
    Wand2,
    ShoppingCart,
    Heart,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Sun,
    Cloud,
    Snowflake,
    Leaf,
    Zap,
    Save,
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface OutfitItem {
    id?: string
    name: string
    category: string
    color: string
    source: 'closet' | 'store'
    productId?: string
    reason: string
    productDetails?: {
        price: number
        images: string
    }
}

interface Outfit {
    name: string
    description: string
    items: OutfitItem[]
    occasion: string
    confidence: number
    stylingTips: string[]
}

const OCCASIONS = [
    { value: 'casual', label: 'Casual', icon: '👕', desc: 'Día a día relajado' },
    { value: 'formal', label: 'Formal', icon: '👔', desc: 'Eventos importantes' },
    { value: 'party', label: 'Fiesta', icon: '🎉', desc: 'Celebraciones' },
    { value: 'business', label: 'Trabajo', icon: '💼', desc: 'Ambiente profesional' },
    { value: 'date', label: 'Cita', icon: '💝', desc: 'Ocasión romántica' },
    { value: 'sport', label: 'Deporte', icon: '🏃', desc: 'Actividad física' },
]

const SEASONS = [
    { value: 'spring', label: 'Primavera', icon: Leaf, color: 'text-green-400' },
    { value: 'summer', label: 'Verano', icon: Sun, color: 'text-yellow-400' },
    { value: 'autumn', label: 'Otoño', icon: Cloud, color: 'text-orange-400' },
    { value: 'winter', label: 'Invierno', icon: Snowflake, color: 'text-blue-400' },
]

export default function OutfitGenerator() {
    const [occasion, setOccasion] = useState('casual')
    const [season, setSeason] = useState('summer')
    const [useEnhanced, setUseEnhanced] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [outfits, setOutfits] = useState<Outfit[]>([])
    const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0)
    const [hasClosetItems, setHasClosetItems] = useState(true)

    const generateOutfits = async () => {
        setIsGenerating(true)

        try {
            const endpoint = useEnhanced ? '/api/ai/outfits/enhanced' : '/api/ai/outfits'

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    occasion,
                    season,
                    numberOfOutfits: 3,
                    saveOutfits: true,
                    ...(useEnhanced && { budget: 500 }),
                }),
            })

            const data = await response.json()

            if (response.status === 400 && data.emptyCloset) {
                setHasClosetItems(false)
                toast.error('Primero agrega prendas a tu closet')
                return
            }

            if (response.status === 429) {
                toast.error(data.message || 'Límite de generación alcanzado')
                return
            }

            if (!response.ok) {
                throw new Error(data.error || 'Error generando outfits')
            }

            setOutfits(data.outfits || [])
            setCurrentOutfitIndex(0)
            toast.success(`¡${data.outfits.length} outfits generados con IA!`)
        } catch (error: any) {
            console.error('Error:', error)
            toast.error(error.message || 'Error generando outfits')
        } finally {
            setIsGenerating(false)
        }
    }

    const nextOutfit = () => {
        if (currentOutfitIndex < outfits.length - 1) {
            setCurrentOutfitIndex(currentOutfitIndex + 1)
        }
    }

    const prevOutfit = () => {
        if (currentOutfitIndex > 0) {
            setCurrentOutfitIndex(currentOutfitIndex - 1)
        }
    }

    const saveOutfit = async () => {
        if (!currentOutfit) return

        try {
            const response = await fetch('/api/outfits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: currentOutfit.name,
                    description: currentOutfit.description,
                    items: currentOutfit.items,
                    occasion: currentOutfit.occasion,
                    season: season,
                    aiGenerated: true,
                }),
            })

            if (!response.ok) {
                throw new Error('Error guardando outfit')
            }

            toast.success('¡Outfit guardado en tu colección!')
        } catch (error) {
            console.error('Error:', error)
            toast.error('No se pudo guardar el outfit')
        }
    }

    const currentOutfit = outfits[currentOutfitIndex]

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 md:px-8">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Premium Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-bold mb-4">
                        <Wand2 className="w-4 h-4 animate-pulse" />
                        Generador IA Gemini
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                            Outfit Generator
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Crea combinaciones perfectas con inteligencia artificial. Deja que Gemini diseñe outfits únicos para ti.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Occasion selector */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="font-black mb-4 flex items-center gap-2 text-white text-lg">
                                <Calendar className="w-5 h-5 text-indigo-400" />
                                Ocasión
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {OCCASIONS.map((occ) => (
                                    <motion.button
                                        key={occ.value}
                                        onClick={() => setOccasion(occ.value)}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${occasion === occ.value
                                            ? 'border-indigo-500/50 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 shadow-lg shadow-indigo-500/20'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{occ.icon}</div>
                                        <div className={`font-bold text-sm mb-1 ${occasion === occ.value ? 'text-indigo-200' : 'text-white'}`}>{occ.label}</div>
                                        <div className="text-xs text-slate-400">{occ.desc}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Season selector */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="font-black mb-4 text-white text-lg">Temporada</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {SEASONS.map((s) => (
                                    <motion.button
                                        key={s.value}
                                        onClick={() => setSeason(s.value)}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${season === s.value
                                            ? 'border-indigo-500/50 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 shadow-lg shadow-indigo-500/20'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                                            }`}
                                    >
                                        <s.icon className={`w-8 h-8 mb-2 ${season === s.value ? s.color : 'text-slate-400'}`} />
                                        <div className={`font-bold text-sm ${season === s.value ? 'text-indigo-200' : 'text-white'}`}>{s.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced mode toggle */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={useEnhanced}
                                    onChange={(e) => setUseEnhanced(e.target.checked)}
                                    className="w-5 h-5 rounded accent-indigo-500 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <div className="font-bold text-white">Modo Mejorado</div>
                                    <div className="text-sm text-slate-400">
                                        Incluye productos de la tienda en los outfits
                                    </div>
                                </div>
                                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                            </label>
                        </div>

                        {/* Generate button */}
                        <motion.button
                            onClick={generateOutfits}
                            disabled={isGenerating || !hasClosetItems}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-6 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                    Generando con IA...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    Generar Outfits
                                </>
                            )}
                        </motion.button>

                        {!hasClosetItems && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300"
                            >
                                <Zap className="w-5 h-5 inline mr-2 text-amber-400" />
                                Primero agrega prendas a tu Smart Closet
                            </motion.div>
                        )}
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {outfits.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-slate-900/40 backdrop-blur-sm border-2 border-dashed border-slate-700 rounded-3xl p-16 text-center h-full flex flex-col items-center justify-center min-h-[600px]"
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-6">
                                        <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-3">Sin outfits aún</h3>
                                    <p className="text-slate-400 text-lg max-w-md">
                                        Selecciona una ocasión y temporada, luego genera tu primer outfit con IA
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`outfit-${currentOutfitIndex}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/20"
                                >
                                    {/* Outfit header */}
                                    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-3xl md:text-4xl font-black mb-2 text-white">{currentOutfit.name}</h2>
                                            <p className="text-slate-400 mb-4 leading-relaxed">{currentOutfit.description}</p>
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold">
                                                    {outfits[currentOutfitIndex].occasion}
                                                </span>
                                                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 text-sm font-bold">
                                                    {Math.round(outfits[currentOutfitIndex].confidence * 100)}% Match
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Save button */}
                                            <motion.button
                                                onClick={saveOutfit}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span className="hidden sm:inline">Guardar</span>
                                            </motion.button>

                                            {/* Navigation */}
                                            {outfits.length > 1 && (
                                                <>
                                                    <motion.button
                                                        onClick={prevOutfit}
                                                        disabled={currentOutfitIndex === 0}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={nextOutfit}
                                                        disabled={currentOutfitIndex === outfits.length - 1}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
                                                    >
                                                        <ChevronRight className="w-5 h-5" />
                                                    </motion.button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                        {currentOutfit.items.map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                whileHover={{ y: -4 }}
                                                className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 hover:shadow-xl hover:border-indigo-500/30 transition-all"
                                            >
                                                <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-3 flex items-center justify-center text-5xl">
                                                    {item.category === 'shirt' && '👕'}
                                                    {item.category === 'pants' && '👖'}
                                                    {item.category === 'dress' && '👗'}
                                                    {item.category === 'shoes' && '👟'}
                                                    {item.category === 'jacket' && '🧥'}
                                                    {item.category === 'accessories' && '👜'}
                                                </div>
                                                <h4 className="font-black text-sm mb-1 text-white truncate">{item.name}</h4>
                                                <p className="text-xs text-slate-400 mb-2 line-clamp-2">{item.reason}</p>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-5 h-5 rounded-lg border-2 border-slate-600 shadow-inner"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className={`text-xs font-bold capitalize ${item.source === 'closet' ? 'text-indigo-400' : 'text-purple-400'}`}>
                                                        {item.source}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Styling tips */}
                                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6">
                                        <h4 className="font-black mb-4 flex items-center gap-2 text-white text-lg">
                                            <Sparkles className="w-5 h-5 text-indigo-400" />
                                            Tips de Estilismo IA
                                        </h4>
                                        <ul className="space-y-3">
                                            {currentOutfit.stylingTips.map((tip, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="text-sm text-slate-300 flex items-start gap-3"
                                                >
                                                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">✨</span>
                                                    <span className="leading-relaxed">{tip}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Counter */}
                                    {outfits.length > 1 && (
                                        <div className="text-center mt-6 text-sm text-slate-500 font-bold">
                                            Outfit {currentOutfitIndex + 1} de {outfits.length}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
