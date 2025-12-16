'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { ShoppingBag, Sparkles, ArrowRight, Star, Zap } from 'lucide-react'

export default function HeroSection() {
    const { t } = useLanguage()

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[20%] right-[20%] w-[200px] h-[200px] bg-pink-200/30 rounded-full blur-[60px] animate-float-slow" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-10 pb-20 relative z-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-sm font-semibold tracking-wide uppercase">
                        {t('home.hero.badge')}
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tight leading-tight"
                >
                    <span className="block text-slate-900">{t('home.hero.title').split(' ')[0]}</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        {t('home.hero.title').split(' ').slice(1).join(' ')}
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    {t('home.hero.description')}
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-20"
                >
                    <Link href="/productos">
                        <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group text-white shadow-lg shadow-indigo-500/25">
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {t('home.hero.cta')}
                        </button>
                    </Link>

                    <Link href="/colecciones">
                        <button className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 group bg-white/80 backdrop-blur-sm border-white/40 hover:bg-white">
                            {t('home.hero.explore')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>

                {/* Floating Hero Visual (Optional - Dynamic Composition) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl px-4 pointer-events-none z-0 hidden lg:block">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute right-0 top-20 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="absolute left-10 bottom-20 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-2xl animate-float"
                    />
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full"
                >
                    {[
                        { label: 'Productos', value: '500+', icon: ShoppingBag },
                        { label: 'Calidad', value: '100%', icon: Star },
                        { label: 'Envíos', value: '24h', icon: Sparkles },
                        { label: 'Garantía', value: '30 Días', icon: Zap },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                            <div className="p-4 rounded-2xl bg-slate-50 text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                <p className="text-sm uppercase tracking-wider text-slate-400 font-bold mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}