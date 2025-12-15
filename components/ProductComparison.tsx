'use client'

import { useState, useEffect } from 'react'
import { X, Check, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Product {
    id: string
    name: string
    price: number
    images: string
    category: string
    stock: number
    sizes: string
    colors: string
}

export default function ProductComparison() {
    const [compareList, setCompareList] = useState<Product[]>([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('compareProducts')
        if (stored) {
            try {
                setCompareList(JSON.parse(stored))
            } catch (e) {
                console.error('Error parsing compare list:', e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('compareProducts', JSON.stringify(compareList))
        if (compareList.length > 0) {
            setIsOpen(true)
        }
    }, [compareList])

    const removeProduct = (productId: string) => {
        setCompareList(compareList.filter((p) => p.id !== productId))
    }

    const clearAll = () => {
        setCompareList([])
        setIsOpen(false)
    }

    if (compareList.length === 0) return null

    const getFirstImage = (images: string): string => {
        try {
            const parsed = JSON.parse(images)
            return Array.isArray(parsed) ? parsed[0] : images
        } catch {
            return images
        }
    }

    const features: Array<{
        key: keyof Product
        label: string
        format: (val: string | number) => string
    }> = [
            { key: 'price', label: 'Precio', format: (val: string | number) => `$${Number(val).toFixed(2)}` },
            { key: 'category', label: 'Categoría', format: (val: string | number) => String(val) },
            { key: 'stock', label: 'Stock', format: (val: string | number) => `${val} unidades` },
            {
                key: 'sizes',
                label: 'Tallas',
                format: (val: string | number) => {
                    try {
                        return JSON.parse(String(val)).join(', ')
                    } catch {
                        return String(val)
                    }
                },
            },
            {
                key: 'colors',
                label: 'Colores',
                format: (val: string | number) => {
                    try {
                        return JSON.parse(String(val)).join(', ')
                    } catch {
                        return String(val)
                    }
                },
            },
        ]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Comparar Productos ({compareList.length}/4)
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Compara hasta 4 productos lado a lado
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 text-gray-600 hover:text-red-600 font-semibold transition"
                                >
                                    Limpiar Todo
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <tbody>
                                        {/* Product Images & Names */}
                                        <tr>
                                            <td className="p-4 font-semibold text-gray-700 align-top w-32">
                                                Producto
                                            </td>
                                            {compareList.map((product) => (
                                                <td key={product.id} className="p-4 align-top">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => removeProduct(product.id)}
                                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition z-10"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <img
                                                            src={getFirstImage(product.images)}
                                                            alt={product.name}
                                                            className="w-48 h-48 object-cover rounded-lg mb-3"
                                                        />
                                                        <p className="font-semibold text-center">
                                                            {product.name}
                                                        </p>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>

                                        {/* Features */}
                                        {features.map((feature, idx) => (
                                            <tr
                                                key={feature.key}
                                                className={idx % 2 === 0 ? 'bg-gray-50' : ''}
                                            >
                                                <td className="p-4 font-semibold text-gray-700">
                                                    {feature.label}
                                                </td>
                                                {compareList.map((product) => (
                                                    <td key={product.id} className="p-4">
                                                        {feature.format(
                                                            product[feature.key as keyof Product] as any
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}

                                        {/* Actions */}
                                        <tr>
                                            <td className="p-4"></td>
                                            {compareList.map((product) => (
                                                <td key={product.id} className="p-4">
                                                    <Link
                                                        href={`/productos/${product.id}`}
                                                        className="inline-flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                                                    >
                                                        Ver Detalles
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Hook to add products to comparison
export function useProductComparison() {
    const addToComparison = (product: Product) => {
        const stored = localStorage.getItem('compareProducts')
        let current: Product[] = []

        if (stored) {
            try {
                current = JSON.parse(stored)
            } catch (e) {
                console.error('Error parsing compare list:', e)
            }
        }

        // Check if already in list
        if (current.find((p) => p.id === product.id)) {
            return { success: false, message: 'Ya está en la comparación' }
        }

        // Max 4 products
        if (current.length >= 4) {
            return { success: false, message: 'Máximo 4 productos para comparar' }
        }

        current.push(product)
        localStorage.setItem('compareProducts', JSON.stringify(current))

        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'))

        return { success: true, message: 'Agregado a la comparación' }
    }

    const getCompareCount = (): number => {
        const stored = localStorage.getItem('compareProducts')
        if (!stored) return 0
        try {
            return JSON.parse(stored).length
        } catch {
            return 0
        }
    }

    return { addToComparison, getCompareCount }
}
