'use client'

import { useWishlist } from '@/context/WishlistContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmptyState from '@/components/EmptyState'
import Badge from '@/components/Badge'
import { Heart, ShoppingCart, Trash2, ArrowRight, Package, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import type { WishlistItem } from '@/context/WishlistContext'

export default function WishlistPage() {
    const { items, removeItem, clearWishlist, isLoaded } = useWishlist()
    const { addItem: addToCart } = useCart()
    const router = useRouter()
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const toggleSelect = (productId: string) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(productId)) {
            newSelected.delete(productId)
        } else {
            newSelected.add(productId)
        }
        setSelectedItems(newSelected)
    }

    const handleAddToCart = (item: WishlistItem) => {
        try {
            addToCart({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: 1,
                size: 'M',
                color: 'Blanco',
                image: item.image
            })
            toast.success('✅ Agregado al carrito')
        } catch {
            toast.error('Error al agregar al carrito')
        }
    }

    const handleAddSelectedToCart = () => {
        let count = 0
        items.forEach(item => {
            if (selectedItems.has(item.productId)) {
                handleAddToCart(item)
                count++
            }
        })
        if (count > 0) {
            toast.success(`✅ ${count} producto${count > 1 ? 's' : ''} agregado${count > 1 ? 's' : ''} al carrito`)
            setSelectedItems(new Set())
        }
    }

    const handleCopyLink = (productId: string) => {
        const link = `${window.location.origin}/productos/${productId}`
        navigator.clipboard.writeText(link)
        setCopiedId(productId)
        toast.success('Enlace copiado')
        setTimeout(() => setCopiedId(null), 2000)
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-950">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="rounded-full h-12 w-12 border-4 border-slate-800 border-t-red-600"
                    />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
                <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between flex-wrap gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 12 }}
                                className="p-4 bg-red-600/10 backdrop-blur rounded-2xl border border-red-500/20"
                            >
                                <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Mis Favoritos</h1>
                                <p className="text-slate-400 mt-2">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
                            </div>
                        </div>
                        {items.length > 0 && (
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Valor total</p>
                                <p className="text-3xl font-black text-red-500">${totalPrice.toFixed(2)}</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {items.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <EmptyState
                            icon={Heart}
                            title="Wishlist Vacío"
                            description="Agrega productos a favoritos y aparecerán aquí. ¡Comienza a explorar nuestras colecciones!"
                            actionLabel="Explorar Productos"
                            actionHref="/productos"
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Toolbar */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-dark p-4 flex flex-wrap items-center justify-between gap-4"
                        >
                            <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-800 px-3 py-2 rounded-xl transition">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.size === items.length && items.length > 0}
                                    onChange={() => {
                                        if (selectedItems.size === items.length) {
                                            setSelectedItems(new Set())
                                        } else {
                                            setSelectedItems(new Set(items.map(i => i.productId)))
                                        }
                                    }}
                                    className="w-5 h-5 rounded border-slate-700 cursor-pointer accent-red-600"
                                />
                                <span className="text-white font-semibold">
                                    {selectedItems.size === 0 ? 'Seleccionar todo' : `${selectedItems.size} seleccionado${selectedItems.size > 1 ? 's' : ''}`}
                                </span>
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                <AnimatePresence>
                                    {selectedItems.size > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={handleAddSelectedToCart}
                                            className="btn-primary"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Agregar {selectedItems.size} al carrito
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearWishlist}
                                    className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition font-semibold border border-red-500/20"
                                >
                                    Limpiar todo
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Grid de Productos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {items.map((item, idx) => (
                                    <motion.div
                                        key={item.productId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="card-dark overflow-hidden group relative"
                                    >
                                        {/* Checkbox */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <motion.label
                                                whileHover={{ scale: 1.1 }}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.has(item.productId)}
                                                    onChange={() => toggleSelect(item.productId)}
                                                    className="w-5 h-5 rounded border-slate-700 cursor-pointer accent-red-600"
                                                />
                                            </motion.label>
                                        </div>

                                        {/* Image */}
                                        <div className="relative w-full h-56 bg-slate-800 overflow-hidden">
                                            {item.image ? (
                                                <div className="w-full h-full relative">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, 33vw"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <Package className="w-12 h-12" />
                                                </div>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => removeItem(item.productId)}
                                                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition shadow-lg"
                                                title="Remover de favoritos"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </div>

                                        {/* Info */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-lg text-white line-clamp-2 flex-1">
                                                    {item.name}
                                                </h3>
                                            </div>
                                            <Badge label="❤️ En Favoritos" variant="error" size="sm" animated />
                                            <p className="text-3xl font-black text-red-500 my-4">
                                                ${item.price.toFixed(2)}
                                            </p>

                                            <div className="space-y-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => router.push(`/productos/${item.productId}`)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold border border-slate-700"
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                    Ver Producto
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAddToCart(item)}
                                                    className="btn-primary w-full justify-center"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Agregar al Carrito
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleCopyLink(item.productId)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition font-semibold text-sm border border-slate-700"
                                                >
                                                    {copiedId === item.productId ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            Copiado!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            Copiar Enlace
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
