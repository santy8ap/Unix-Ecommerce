'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useLanguage } from '@/context/LanguageContext'
import { toast } from 'sonner'
import { getProductImage, parseJSON } from '@/lib/utils'
import { Product } from '@/types'
import RecommendationBadge from './RecommendationBadge'

interface ProductCardProps {
  product: Product & {
    isRecommendedColor?: boolean
    isRecommendedStyle?: boolean
    isRecommended?: boolean
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  const { addItem } = useCart()
  const { addItem: addToWishlist, items: wishlistItems } = useWishlist()

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isInWishlist = wishlistItems.some((item) => item.productId === product.id)

  const sizes = useMemo(() => {
    return Array.isArray(product.sizes) ? product.sizes : []
  }, [product.sizes])

  const colors = useMemo(() => {
    return Array.isArray(product.colors) ? product.colors : []
  }, [product.colors])

  // Initialize defaults
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) setSelectedSize(sizes[0])
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0])
  }, [sizes, colors, selectedSize, selectedColor])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Double check strictly if we want to force selection
    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error(t('notifications.error.selectSizeColor'))
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize || (sizes[0] as string) || 'Standard',
      color: selectedColor || (colors[0] as string) || 'Standard',
      image: getProductImage(product.images),
      stock: product.stock,
    })
    toast.success(t('notifications.success.productAdded'))
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isInWishlist) {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: getProductImage(product.images),
      })
      toast.success(t('notifications.success.addedToWishlist'))
    } else {
      toast.info(t('notifications.info.alreadyInWishlist'))
    }
  }

  return (
    <Link href={`/productos/${product.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative h-full bg-slate-900 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-800 hover:border-indigo-500/50"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-800">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          )}
          <motion.img
            src={getProductImage(product.images)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {/* UNIX AI Recommendation */}
            {product.isRecommended && (
              <RecommendationBadge
                isRecommendedColor={product.isRecommendedColor}
                isRecommendedStyle={product.isRecommendedStyle}
                variant="compact"
              />
            )}
            {product.stock < 10 && product.stock > 0 && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-500/30 backdrop-blur-md">
                Low Stock
              </span>
            )}
            <span className="px-3 py-1 bg-slate-900/80 backdrop-blur text-slate-200 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border border-slate-700">
              {product.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            className="absolute top-4 right-4 p-2.5 bg-slate-900/80 backdrop-blur rounded-full shadow-lg hover:bg-slate-800 transition-colors z-20 border border-slate-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-primary text-primary' : 'text-slate-400'}`} />
          </motion.button>

          {/* Quick Actions Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-4 bottom-4 z-20"
              >
                <div className="p-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50">
                  {/* Size Selector */}
                  {sizes.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                      {(Array.isArray(sizes) ? sizes : []).slice(0, 4).map((size: string) => (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedSize(size)
                          }}
                          className={`flex-shrink-0 w-8 h-8 text-xs font-medium rounded-lg transition-all ${selectedSize === size
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add
                    </button>
                    <div
                      className="px-3 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-200">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
