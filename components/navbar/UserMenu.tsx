'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Package, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface UserMenuProps {
    session: any
    locale: string
    t: (key: string) => string
}

export default function UserMenu({ session, locale, t }: UserMenuProps) {
    const [showUserMenu, setShowUserMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const getUserImage = () => {
        return session?.user?.image || null
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:opacity-80 transition focus:outline-none group"
                aria-label="User menu"
                aria-expanded={showUserMenu}
            >
                {getUserImage() ? (
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={getUserImage() || ''}
                        alt={session.user.name || 'User'}
                        className="w-9 h-9 rounded-full border-2 border-red-500 ring-2 ring-red-500/20 object-cover group-hover:ring-red-500/40 transition"
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold ring-2 ring-red-500/20 group-hover:ring-red-500/40 transition shadow-md"
                    >
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </motion.div>
                )}
                <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-white">
                        {session.user.name?.split(' ')[0] || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-400">
                        {session.user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                    </p>
                </div>
                <motion.svg
                    animate={{ rotate: showUserMenu ? 180 : 0 }}
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </motion.svg>
            </motion.button>

            <AnimatePresence>
                {showUserMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-10"
                            onClick={() => setShowUserMenu(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-3 w-72 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl py-2 z-20 border border-gray-200 overflow-hidden backdrop-blur-md"
                        >
                            <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 via-red-50 to-pink-50">
                                <div className="flex items-center gap-3">
                                    {getUserImage() ? (
                                        <motion.img
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            src={getUserImage() || ''}
                                            alt={session.user.name || 'User'}
                                            className="w-12 h-12 rounded-full border-2 border-red-500 object-cover"
                                        />
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
                                        >
                                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </motion.div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {session.user.name || 'Usuario'}
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </div>
                                {session.user.role === 'ADMIN' && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="inline-block mt-3 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full border border-red-200"
                                    >
                                        {locale === 'es' ? 'Administrador' : 'Administrator'}
                                    </motion.span>
                                )}
                            </div>

                            <div className="py-2">
                                <Link
                                    href="/mis-ordenes"
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Package className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
                                    <span className="group-hover:text-red-600 font-medium">
                                        {t('nav.myOrders')}
                                    </span>
                                </Link>

                                {session.user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
                                        <span className="group-hover:text-red-600 font-medium">
                                            {locale === 'es' ? 'Panel Admin' : 'Admin Panel'}
                                        </span>
                                    </Link>
                                )}

                                <div className="border-t border-gray-200 my-2"></div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => {
                                        setShowUserMenu(false)
                                        signOut({ callbackUrl: '/' })
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                >
                                    <LogOut className="w-4 h-4 mr-3 group-hover:text-red-700 transition-colors" />
                                    <span className="group-hover:text-red-700 font-medium">
                                        {t('nav.signOut')}
                                    </span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
