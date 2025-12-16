'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIStylingChat from '@/components/ai/AIStylingChat'
import {
    Sparkles, Zap, Palette, Shirt, Heart,
    TrendingUp, ArrowRight, Bot, User
} from 'lucide-react'
import Link from 'next/link'

export default function AIStylistPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<'chat' | 'outfits' | 'tips'>('chat')
    const [generatedOutfitId, setGeneratedOutfitId] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Navbar />

            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-400">Powered by Gemini AI</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                        Tu Asistente de
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Moda Personal
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                        Chatea con UNIX AI, descubre tu estilo único y genera outfits personalizados
                        basados en tus gustos, colorimetría y ocasión.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
                        {[
                            { icon: Bot, label: 'Chat IA', value: 'Ilimitado' },
                            { icon: Shirt, label: 'Outfits', value: 'Personalizados' },
                            { icon: Palette, label: 'Colores', value: 'Análisis' },
                            { icon: Zap, label: 'Velocidad', value: 'Instantáneo' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4"
                            >
                                <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                                <div className="font-black text-white text-lg">{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Chat Section - 2/3 width */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <AIStylingChat onOutfitGenerated={(id) => setGeneratedOutfitId(id)} />
                        </motion.div>
                    </div>

                    {/* Sidebar - 1/3 width */}
                    <div className="space-y-6">
                        {/* How it Works */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
                        >
                            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-indigo-400" />
                                Cómo Funciona
                            </h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        num: '1',
                                        title: 'Háblame de ti',
                                        desc: 'Cuéntame tus gustos: anime, streetwear, formal, etc.'
                                    },
                                    {
                                        num: '2',
                                        title: 'Analizo tu estilo',
                                        desc: 'Proceso tus preferencias y análisis de colorimetría'
                                    },
                                    {
                                        num: '3',
                                        title: 'Genero outfits',
                                        desc: 'Creo combinaciones perfectas de la tienda y tu closet'
                                    },
                                    {
                                        num: '4',
                                        title: 'Guarda favoritos',
                                        desc: 'Colecciona los outfits que más te gusten'
                                    }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-white">
                                            {step.num}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{step.title}</h4>
                                            <p className="text-xs text-slate-400">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
                        >
                            <h3 className="text-xl font-black text-white mb-4">
                                Acciones Rápidas
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    href="/closet"
                                    className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Shirt className="w-5 h-5 text-purple-400" />
                                            <span className="font-medium text-white">Mi Closet</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                </Link>

                                <Link
                                    href="/outfits"
                                    className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Heart className="w-5 h-5 text-pink-400" />
                                            <span className="font-medium text-white">Mis Outfits</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                </Link>

                                <Link
                                    href="/productos"
                                    className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                                            <span className="font-medium text-white">Explorar Tienda</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Tips */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-black text-white mb-3">💡 Tips Pro</h3>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <span>Sé específico: "Me gusta el anime tipo Attack on Titan"</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <span>Menciona ocasiones: universidad, fiesta, cita, etc.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-400 font-bold">•</span>
                                    <span>Pregunta por colores que te favorecen</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            icon: Palette,
                            title: 'Análisis de Colorimetría',
                            desc: 'IA analiza tu tono de piel y recomienda colores',
                            color: 'from-pink-600 to-rose-600'
                        },
                        {
                            icon: Shirt,
                            title: 'Closet Inteligente',
                            desc: 'Combina prendas de tu closet con productos nuevos',
                            color: 'from-purple-600 to-indigo-600'
                        },
                        {
                            icon: Sparkles,
                            title: 'Outfits Personalizados',
                            desc: 'Generados según tus gustos y la ocasión',
                            color: 'from-indigo-600 to-blue-600'
                        }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-black text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            <Footer />
        </div>
    )
}
