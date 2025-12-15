'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Home, ShoppingCart, Sparkles, Wand2, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface DesktopNavProps {
    session: any
    t: (key: string) => string
}

export default function DesktopNav({ session, t }: DesktopNavProps) {
    const pathname = usePathname()
    const [showAIMenu, setShowAIMenu] = useState(false)

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const isAIActive = pathname === '/closet' || pathname === '/outfits'

    const navLinks = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/productos', label: t('nav.products'), icon: ShoppingCart },
    ]

    const aiFeatures = session ? [
        { href: '/ai-stylist', label: 'AI Stylist', icon: Sparkles, description: 'Chatea con IA de moda', badge: 'NEW' },
        { href: '/closet', label: 'Smart Closet', icon: Sparkles, description: 'Tu armario virtual' },
        { href: '/outfits', label: 'Generador IA', icon: Wand2, description: 'Outfits personalizados' },
    ] : []

    return (
        <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="relative group"
                    >
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${active
                            ? 'text-primary bg-primary/10 font-bold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}>
                            <link.icon className="w-4 h-4" />
                            <span className="font-medium hidden lg:inline text-sm">
                                {link.label}
                            </span>
                        </div>
                    </Link>
                )
            })}

            {/* AI Features Dropdown */}
            {session && aiFeatures.length > 0 && (
                <div
                    className="relative"
                    onMouseEnter={() => setShowAIMenu(true)}
                    onMouseLeave={() => setShowAIMenu(false)}
                >
                    <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isAIActive
                            ? 'text-primary bg-primary/10 font-bold'
                            : 'text-slate-500 hover:text-primary hover:bg-primary/5'
                            }`}
                    >
                        <Sparkles className={`w-4 h-4 ${!isAIActive ? 'animate-pulse' : ''}`} />
                        <span className="font-medium hidden lg:inline text-sm">UNIX IA</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showAIMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showAIMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full mt-2 right-0 w-64 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50"
                            >
                                <div className="p-2">
                                    {aiFeatures.map((feature, index) => (
                                        <Link
                                            key={feature.href}
                                            href={feature.href}
                                            className="block"
                                        >
                                            <div
                                                className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-slate-50 ${pathname === feature.href ? 'bg-primary/5' : ''
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <feature.icon className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-bold text-sm text-slate-900">
                                                            {feature.label}
                                                        </span>
                                                        {feature.badge && (
                                                            <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold rounded-full">
                                                                {feature.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {feature.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {session?.user?.role === 'ADMIN' && (
                <Link
                    href="/admin"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-sm ${isActive('/admin')
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <Settings className="w-4 h-4" />
                    <span className="hidden lg:inline">Admin</span>
                </Link>
            )}
        </div>
    )
}
