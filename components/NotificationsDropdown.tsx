/**
 * Notifications Dropdown Component
 * Muestra notificaciones del usuario en el navbar
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Trash2, Package, DollarSign, Sparkles, Tag, X } from 'lucide-react'
import { notificationService, type Notification } from '@/lib/notifications'
import Link from 'next/link'

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        loadNotifications()

        // Actualizar cada 30 segundos
        const interval = setInterval(loadNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const loadNotifications = () => {
        setNotifications(notificationService.getNotifications())
        setUnreadCount(notificationService.getUnreadCount())
    }

    const handleMarkAsRead = (id: string) => {
        notificationService.markAsRead(id)
        loadNotifications()
    }

    const handleDelete = (id: string) => {
        notificationService.deleteNotification(id)
        loadNotifications()
    }

    const handleMarkAllAsRead = () => {
        notificationService.markAllAsRead()
        loadNotifications()
    }

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'order':
                return <Package className="w-5 h-5" />
            case 'payment':
                return <DollarSign className="w-5 h-5" />
            case 'ai':
                return <Sparkles className="w-5 h-5" />
            case 'promotion':
                return <Tag className="w-5 h-5" />
            default:
                return <Bell className="w-5 h-5" />
        }
    }

    const getColorClass = (type: Notification['type']) => {
        switch (type) {
            case 'order':
                return 'bg-blue-500/10 text-blue-400'
            case 'payment':
                return 'bg-green-500/10 text-green-400'
            case 'ai':
                return 'bg-purple-500/10 text-purple-400'
            case 'promotion':
                return 'bg-orange-500/10 text-orange-400'
            default:
                return 'bg-slate-500/10 text-slate-400'
        }
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6 text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-white">Notificaciones</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                                    >
                                        Marcar todas como leídas
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm">
                                            No tienes notificaciones
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${!notification.read ? 'bg-slate-800/20' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon */}
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(notification.type)}`}>
                                                    {getIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={`font-bold text-sm ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <div className="flex items-center gap-1">
                                                            {!notification.read && (
                                                                <button
                                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                                                                    title="Marcar como leída"
                                                                >
                                                                    <Check className="w-4 h-4 text-green-400" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(notification.id)}
                                                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <X className="w-4 h-4 text-slate-400" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {notification.message}
                                                    </p>

                                                    {notification.link && (
                                                        <Link
                                                            href={notification.link}
                                                            onClick={() => {
                                                                handleMarkAsRead(notification.id)
                                                                setIsOpen(false)
                                                            }}
                                                            className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
                                                        >
                                                            Ver detalles →
                                                        </Link>
                                                    )}

                                                    <p className="text-xs text-slate-500 mt-2">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function formatTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    if (days < 7) return `Hace ${days}d`

    return date.toLocaleDateString('es', { month: 'short', day: 'numeric' })
}
