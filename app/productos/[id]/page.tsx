'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { trackProductView } from '@/components/RecentlyViewedProducts'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductReviews from '@/components/ProductReviews'
import RecentlyViewedProducts from '@/components/RecentlyViewedProducts'
import { ChevronLeft, ShoppingCart, Heart, Share2, Star, ShieldCheck, Truck, Ruler, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Product {
    id: string
    name: string
    price: number
    description: string
    images: string[]
    category: string
    stock: number
    sizes: string[]
    colors: string[]
    [key: string]: unknown
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)

    // Check if product is in wishlist
    const isInWishlist = wishlistItems.some(item => item.productId === product?.id)

    useEffect(() => {
        if (params.id) {
            fetchProduct()
            trackProductView(params.id as string)
        }
    }, [params.id])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            if (!response.ok) throw new Error('Producto no encontrado')
            const data = await response.json()

            // Validation/Normalization (ensure arrays)
            const productData = {
                ...data,
                images: Array.isArray(data.images) ? data.images : [data.images].filter(Boolean),
                sizes: Array.isArray(data.sizes) ? data.sizes : [],
                colors: Array.isArray(data.colors) ? data.colors : []
            }

            setProduct(productData)

            if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0])
            if (productData.colors?.length > 0) setSelectedColor(productData.colors[0])
        } catch (error) {
            console.error('Error fetching product:', error)
            toast.error('No se pudo cargar el producto')
        } finally {
            setLoading(false)
        }
    }

    const toggleWishlist = () => {
        if (!product) return

        if (isInWishlist) {
            removeFromWishlist(product.id)
            toast.success('Eliminado de favoritos')
        } else {
            addToWishlist({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '',
            })
            toast.success('Agregado a favoritos')
        }
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error('Por favor selecciona talla y color')
            return
        }

        addItem({
            productId: product!.id,
            name: product!.name,
            price: product!.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: product!.images[0] || ''
        })

        toast.success('Agregado al carrito')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="h-screen flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (!product) return null

    // Direct access variables for cleaner JSX
    const { images, sizes, colors } = product

    return (
        <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-900">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Products
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Gallery Section - Sticky on Desktop */}
                        <div className="lg:sticky lg:top-32 h-fit space-y-4">
                            <div className="relative aspect-[3/4] bg-slate-100 rounded-[2rem] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Floating Actions */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <button
                                        onClick={toggleWishlist}
                                        className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-slate-900'}`} />
                                    </button>
                                    <button className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all active:scale-95">
                                        <Share2 className="w-5 h-5 text-slate-900" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative aspect-square rounded-xl overflow-hidden transition-all ${selectedImage === idx ? 'ring-2 ring-slate-900 ring-offset-2' : 'opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-10">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full">
                                        {product.category}
                                    </span>
                                    {product.stock < 10 && product.stock > 0 && (
                                        <span className="text-red-600 text-xs font-bold animate-pulse">
                                            Only {product.stock} left!
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    {product.name}
                                </h1>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl font-bold text-slate-900">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium text-slate-900">4.9</span>
                                        <span className="text-sm text-slate-500">(128 reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {product.description}
                                </p>
                            </div>

                            {/* Selectors */}
                            <div className="space-y-8 py-8 border-y border-slate-100">
                                {/* Colors */}
                                {colors.length > 0 && (
                                    <div className="space-y-4">
                                        <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Color</span>
                                        <div className="flex flex-wrap gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110'
                                                        }`}
                                                >
                                                    <span
                                                        className="w-full h-full rounded-full border border-slate-200"
                                                        style={{ backgroundColor: color.toLowerCase() }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {sizes.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Size</span>
                                            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                                                <Ruler className="w-3 h-3" />
                                                Size Guide
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`h-12 rounded-xl font-bold text-sm transition-all ${selectedSize === size
                                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex items-center bg-slate-50 rounded-xl px-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className="flex-1 bg-slate-900 text-white h-14 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                                    <Truck className="w-3 h-3" />
                                    Free shipping on orders over $200
                                </p>
                            </div>

                            {/* Features Accordion (Visual only for now) */}
                            <div className="space-y-4 pt-8">
                                {[
                                    { icon: ShieldCheck, title: 'Quality Guarantee', desc: '30-day return policy' },
                                    { icon: Info, title: 'Care Instructions', desc: 'Machine wash cold, tumble dry low' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <item.icon className="w-5 h-5 text-slate-900" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-32">
                        <ProductReviews productId={product.id} />
                    </div>

                    <div className="mt-32 border-t border-slate-100 pt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">You might also like</h2>
                        <RecentlyViewedProducts />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}