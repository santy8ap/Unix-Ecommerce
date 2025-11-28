'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Package } from 'lucide-react'
import ProductForm from '@/components/ProductForm'
import Loading from '@/components/Loading'
import { toast } from 'sonner'

export default function EditProductPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            toast.error('No tienes permisos de administrador')
            router.push('/')
            return
        }

        if (status === 'authenticated' && params.id) {
            fetchProduct()
        }
    }, [status, session, params.id])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            if (!response.ok) throw new Error('Error al cargar producto')
            const data = await response.json()
            setProduct(data)
        } catch (error) {
            console.error('Error:', error)
            toast.error('No se pudo cargar el producto')
            router.push('/admin')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return <Loading />
    }

    if (!product) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Link href="/admin" className="group">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver al Panel
                            </motion.button>
                        </Link>
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                    <Edit className="w-8 h-8 text-white" />
                                </div>
                                Editar Producto
                            </h1>
                            <p className="text-gray-600 max-w-2xl">
                                Modifica los detalles del producto a continuación. Los cambios se reflejarán inmediatamente en el catálogo.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
                >
                    <ProductForm product={product} isEdit={true} />
                </motion.div>

                {/* Help section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
                >
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Recordatorios de edición
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Si cambias el precio, afectará a futuras compras</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Puedes desactivar el producto temporalmente en lugar de eliminarlo</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    )
}
