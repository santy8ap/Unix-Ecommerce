'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    Shield,
    ArrowLeft,
    Star,
    Check,
    Info
} from 'lucide-react'
import Loading from '@/components/shared/Loading'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const { addItem } = useCart()
    const { locale, t } = useLanguage()

    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [wishlist, setWishlist] = useState(false)

    useEffect(() => {
        fetchProduct()
    }, [params.id])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            const data = await response.json()
            setProduct(data)

            if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
            if (data.colors?.length > 0) setSelectedColor(data.colors[0])
        } catch (error) {
            console.error('Error fetching product:', error)
            toast.error('Error al cargar el producto')
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error(locale === 'es' ? 'Selecciona talla y color' : 'Select size and color')
            return
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: product.images[0] || ''
        })

        toast.success(locale === 'es' ? 'Producto agregado al carrito' : 'Product added to cart')
    }

    const toggleWishlist = () => {
        setWishlist(!wishlist)
        toast.success(
            wishlist
                ? (locale === 'es' ? 'Eliminado de favoritos' : 'Removed from wishlist')
                : (locale === 'es' ? 'Agregado a favoritos' : 'Added to wishlist')
        )
    }

    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success(locale === 'es' ? 'Enlace copiado' : 'Link copied')
        }
    }

    if (loading) return <Loading />

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {locale === 'es' ? 'Producto no encontrado' : 'Product not found'}
                </h2>
                <button
                    onClick={() => router.push('/productos')}
                    className="text-red-600 hover:text-red-700 font-semibold"
                >
                    {locale === 'es' ? 'Volver a productos' : 'Back to products'}
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-red-600 transition group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {locale === 'es' ? 'Volver' : 'Back'}
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Galería de Imágenes */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        {/* Imagen Principal */}
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl aspect-square">
                            <AnimatePresence mode="wait">
                                {product.images && product.images.length > 0 ? (
                                    <motion.img
                                        key={selectedImage}
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ShoppingCart className="w-24 h-24" />
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.featured && (
                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        {locale === 'es' ? 'Destacado' : 'Featured'}
                                    </span>
                                )}
                                {product.stock < 10 && product.stock > 0 && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {locale === 'es' ? `¡Últimas ${product.stock}!` : `Only ${product.stock} left!`}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleWishlist}
                                    className="bg-white p-3 rounded-full shadow-lg hover:bg-red-50 transition"
                                >
                                    <Heart className={`w-6 h-6 ${wishlist ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={shareProduct}
                                    className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition"
                                >
                                    <Share2 className="w-6 h-6 text-gray-700" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image: string, index: number) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === index
                                            ? 'border-red-600 shadow-lg'
                                            : 'border-gray-300 hover:border-red-400'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Información del Producto */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div>
                            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                {product.category}
                            </span>
                            <h1 className="text-4xl font-black text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black text-red-600">
                                    ${product.price.toFixed(2)}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                        <Check className="w-4 h-4" />
                                        {locale === 'es' ? `En stock (${product.stock})` : `In stock (${product.stock})`}
                                    </span>
                                ) : (
                                    <span className="text-red-600 text-sm font-semibold">
                                        {locale === 'es' ? 'Agotado' : 'Out of stock'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-lg leading-relaxed">
                            {product.description}
                        </p>

                        {/* Size Selector */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                                {locale === 'es' ? 'Selecciona Talla' : 'Select Size'}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes?.map((size: string) => (
                                    <motion.button
                                        key={size}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-6 py-3 border-2 rounded-lg font-bold transition-all ${selectedSize === size
                                            ? 'bg-red-600 text-white border-red-600 shadow-lg'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                                            }`}
                                    >
                                        {size}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                                {locale === 'es' ? 'Selecciona Color' : 'Select Color'}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {product.colors?.map((color: string) => (
                                    <motion.button
                                        key={color}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-6 py-3 border-2 rounded-lg font-bold transition-all ${selectedColor === color
                                            ? 'bg-red-600 text-white border-red-600 shadow-lg'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                                            }`}
                                    >
                                        {color}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                                {locale === 'es' ? 'Cantidad' : 'Quantity'}
                            </label>
                            <div className="flex items-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-bold text-xl"
                                >
                                    -
                                </motion.button>
                                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                                    className="w-12 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-bold text-xl"
                                >
                                    +
                                </motion.button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
                            </button>

                            <button
                                onClick={() => router.push('/checkout')}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Truck className="w-5 h-5" />
                                {locale === 'es' ? 'Comprar ahora' : 'Buy now'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
