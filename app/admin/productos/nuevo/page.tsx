'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Info, Sparkles, Zap, TrendingUp } from 'lucide-react'
import ProductForm from '@/components/ProductForm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NewProductPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/')
            return
        }
    }, [status, session, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al Dashboard
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-bold mb-4">
                                <Plus className="w-4 h-4" />
                                Nuevo Producto
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                                    Agregar Producto
                                </span>
                            </h1>
                            <p className="text-slate-400 text-lg">Crea un nuevo producto para tu tienda</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8"
                        >
                            <ProductForm />
                        </motion.div>
                    </div>

                    {/* Sidebar / Help */}
                    <div className="space-y-6">
                        {/* Guidelines Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-xl rounded-2xl p-6"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                    <Info className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-sm mb-2">Guía de Productos</h3>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Asegúrate de que las imágenes sean de alta calidad (mín 800x800px).
                                        Los títulos claros y descripciones detalladas mejoran la visibilidad.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Tips Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
                        >
                            <h3 className="font-black text-white text-sm mb-5 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                Tips Rápidos
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-xs text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                    <span>Usa nombres únicos para mejor SEO</span>
                                </li>
                                <li className="flex items-start gap-3 text-xs text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                                    <span>Establece precios competitivos</span>
                                </li>
                                <li className="flex items-start gap-3 text-xs text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                                    <span>Agrega múltiples imágenes para mejor conversión</span>
                                </li>
                                <li className="flex items-start gap-3 text-xs text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                    <span>Selecciona todas las tallas y colores disponibles</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Best Practices Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <h3 className="font-black text-white text-sm">Mejores Prácticas</h3>
                                </div>
                                <div className="space-y-3 text-xs text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span>Stock actualizado</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span>Descripciones completas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span>Categorías correctas</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}