'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { toast } from 'sonner'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    price: number
    images: string[] | string
    category: string
    stock?: number
    description?: string
    sizes?: string[]
    colors?: string[]
    originalPrice?: number
}

interface QuickViewModalProps {
    product: Product | null
    isOpen: boolean
    onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [selectedColor, setSelectedColor] = useState<string>('')
    const { addItem: addToCart } = useCart()
    const { isFavorite, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()

    if (!product) return null

    const favorite = isFavorite(product.id)
    const images = Array.isArray(product.images)
        ? product.images
        : typeof product.images === 'string'
            ? JSON.parse(product.images)
            : []

    const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL']
    const colors = product.colors || ['Blanco', 'Negro', 'Gris']

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error('Por favor selecciona talla y color')
            return
        }

        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
            image: images[0] || '/placeholder.jpg',
            stock: product.stock
        })
        toast.success('Agregado al carrito')
    }

    const handleToggleFavorite = () => {
        if (favorite) {
            removeFromWishlist(product.id)
            toast.success('Removido de favoritos')
        } else {
            addToWishlist({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: images[0] || '/placeholder.jpg'
            })
            toast.success('Agregado a favoritos')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
                                {/* Image Gallery */}
                                <div className="p-8 bg-gray-50">
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-md mb-4">
                                        <Image
                                            src={images[selectedImage] || '/placeholder.jpg'}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />

                                        {/* Navigation arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnails */}
                                    {images.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {images.slice(0, 4).map((img: string, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedImage(idx)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === idx ? 'border-red-500' : 'border-transparent'
                                                        }`}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${product.name} ${idx + 1}`}
                                                        width={100}
                                                        height={100}
                                                        className="object-cover w-full h-full"
                                                        unoptimized
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-8 flex flex-col">
                                    {/* Category */}
                                    <span className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">
                                        {product.category}
                                    </span>

                                    {/* Name */}
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-3 mb-6">
                                        <span className="text-4xl font-bold text-red-600">${product.price.toFixed(2)}</span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {product.description && (
                                        <p className="text-gray-600 mb-6">{product.description}</p>
                                    )}

                                    {/* Size Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            Talla <span className="text-red-600">*</span>
                                        </label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`py-2 px-4 rounded-lg border-2 font-semibold transition ${selectedSize === size
                                                            ? 'border-red-500 bg-red-50 text-red-700'
                                                            : 'border-gray-300 hover:border-red-300'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            Color <span className="text-red-600">*</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`py-2 px-4 rounded-lg border-2 font-semibold transition ${selectedColor === color
                                                            ? 'border-red-500 bg-red-50 text-red-700'
                                                            : 'border-gray-300 hover:border-red-300'
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleAddToCart}
                                            className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Agregar al Carrito
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleToggleFavorite}
                                            className={`p-4 rounded-xl border-2 transition ${favorite
                                                    ? 'border-red-500 bg-red-50 text-red-600'
                                                    : 'border-gray-300 hover:border-red-300'
                                                }`}
                                        >
                                            <Heart className="w-6 h-6" fill={favorite ? 'currentColor' : 'none'} />
                                        </motion.button>
                                    </div>

                                    {/* View Full Details */}
                                    <Link
                                        href={`/productos/${product.id}`}
                                        className="mt-4 text-center py-3 text-red-600 hover:text-red-700 font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-5 h-5" />
                                        Ver detalles completos
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
