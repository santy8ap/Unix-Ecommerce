'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Package, LogOut, User, Globe, Home, ShoppingCart, Grid } from 'lucide-react'
import { signIn, signOut } from 'next-auth/react'

interface MobileNavProps {
    showMobileMenu: boolean
    setShowMobileMenu: (show: boolean) => void
    session: any
    locale: string
    toggleLocale: () => void
    t: (key: string) => string
    langLoaded: boolean
}

export default function MobileNav({
    showMobileMenu,
    setShowMobileMenu,
    session,
    locale,
    toggleLocale,
    t,
    langLoaded
}: MobileNavProps) {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const navLinks = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/productos', label: t('nav.products'), icon: ShoppingCart },
        { href: '/colecciones', label: t('nav.collections'), icon: Grid },
    ]

    const getUserImage = () => {
        if (session?.user?.image) {
            if (session.user.image.includes('googleusercontent')) {
                return session.user.image
            }
            return session.user.image
        }
        return null
    }

    return (
        <AnimatePresence>
            {showMobileMenu && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden border-t border-slate-200 overflow-hidden bg-white"
                >
                    <div className="py-4 space-y-3 px-4">
                        {/* User info mobile */}
                        {session && (
                            <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                                {getUserImage() ? (
                                    <img
                                        src={getUserImage() || ''}
                                        alt={session.user.name || 'User'}
                                        className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {session.user.name || 'Usuario'}
                                    </p>
                                    <p className="text-xs text-slate-500">{session.user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation links */}
                        <div className="space-y-2">
                            {navLinks.map((link, idx) => {
                                const active = isActive(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                            ? 'bg-primary/10 text-primary border border-primary/20'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* My Orders */}
                        {session && (
                            <Link
                                href="/mis-ordenes"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg transition text-slate-600 hover:text-slate-900"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <Package className="w-5 h-5 text-primary" />
                                <span className="font-medium">{t('nav.myOrders')}</span>
                            </Link>
                        )}

                        {/* Admin Panel */}
                        {session?.user?.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 bg-primary hover:bg-primary/90 rounded-lg transition font-medium text-white shadow-sm"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <Settings className="w-5 h-5" />
                                <span>{locale === 'es' ? 'Panel Admin' : 'Admin Panel'}</span>
                            </Link>
                        )}

                        {/* Language toggle mobile */}
                        {langLoaded && (
                            <button
                                onClick={() => {
                                    toggleLocale()
                                    setShowMobileMenu(false)
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 rounded-lg transition text-slate-600 hover:text-slate-900"
                            >
                                <Globe className="w-5 h-5 text-primary" />
                                <span className="font-medium">
                                    {locale === 'es' ? 'English' : 'Español'}
                                </span>
                            </button>
                        )}

                        {/* Auth button mobile */}
                        <div className="pt-2 border-t border-slate-200">
                            {session ? (
                                <button
                                    onClick={() => {
                                        setShowMobileMenu(false)
                                        signOut({ callbackUrl: '/' })
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>{t('nav.signOut')}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowMobileMenu(false)
                                        signIn('google', { callbackUrl: '/' })
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition font-semibold"
                                >
                                    <User className="w-5 h-5" />
                                    <span>{t('nav.signIn')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
