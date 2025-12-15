'use client'

import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    ShoppingCart,
    Heart,
    User,
    Menu,
    X,
    Sparkles,
    Search
} from 'lucide-react'
import DesktopNav from './navbar/DesktopNav'
import MobileNav from './navbar/MobileNav'
import UserMenu from './navbar/UserMenu'
import SearchModal from './SearchModal'
import LanguageSelector from './LanguageSelector'
import NotificationsDropdown from './NotificationsDropdown'

export default function Navbar() {
    const { data: session } = useSession()
    const { items: cartItems, isLoaded: cartLoaded } = useCart()
    const { items: wishlistItems, isLoaded: wishlistLoaded } = useWishlist()
    const { locale, setLocale, t, isLoaded: langLoaded } = useLanguage()
    const pathname = usePathname()
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        setShowMobileMenu(false)
        setShowSearch(false)
    }, [pathname])

    const toggleLocale = () => {
        setLocale(locale === 'es' ? 'en' : 'es')
    }

    const cartItemsCount = cartLoaded ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0
    const wishlistCount = wishlistLoaded ? wishlistItems.length : 0

    return (
        <>
            <div className="sticky top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-black/20">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* UNIX Brand Text */}
                        <Link href="/" className="flex items-center group relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                {/* Glow Background */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Text */}
                                <h1 className="relative text-3xl font-black tracking-tighter">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                                        UNIX
                                    </span>
                                    {/* Subtle underline */}
                                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                                </h1>
                            </motion.div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            <DesktopNav session={session} t={t} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search Trigger */}
                            <motion.button
                                onClick={() => setShowSearch(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-900/60 transition-all border border-transparent hover:border-indigo-500/30"
                                title="Buscar"
                            >
                                <Search className="w-5 h-5" />
                            </motion.button>

                            {/* Language Selector */}
                            <LanguageSelector />

                            {/* Wishlist */}
                            <Link href="/wishlist" className="relative group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-slate-900/60 transition-all border border-transparent hover:border-pink-500/30"
                                >
                                    <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                                </motion.div>
                                {wishlistCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg shadow-pink-500/50"
                                    >
                                        {wishlistCount}
                                    </motion.span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link href="/carrito" className="relative group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-900/60 transition-all border border-transparent hover:border-indigo-500/30"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </motion.div>
                                {cartItemsCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg shadow-indigo-500/50"
                                    >
                                        {cartItemsCount}
                                    </motion.span>
                                )}
                            </Link>

                            {/* Notifications (only for authenticated users) */}
                            {session && (
                                <div className="hidden md:block">
                                    <NotificationsDropdown />
                                </div>
                            )}

                            {/* User Menu / Sign In */}
                            {session ? (
                                <UserMenu session={session} locale={locale} t={t} />
                            ) : (
                                <motion.button
                                    onClick={() => signIn('google')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
                                >
                                    <User className="w-4 h-4" />
                                    Iniciar Sesión
                                </motion.button>
                            )}

                            {/* Mobile Menu Toggle */}
                            <motion.button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="md:hidden p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all border border-transparent hover:border-slate-700"
                            >
                                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Nav */}
            <MobileNav
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
                session={session}
                locale={locale}
                toggleLocale={toggleLocale}
                t={t}
                langLoaded={langLoaded}
            />

            <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        </>
    )
}