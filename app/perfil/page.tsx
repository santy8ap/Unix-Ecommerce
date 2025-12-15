'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Mail, Calendar, Settings, LogOut, Trash2,
    ShoppingBag, Star, Shirt, Palette, ChevronRight
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('general')
    const [isLoading, setIsLoading] = useState(false)

    // Redirect if not authenticated
    if (status === 'unauthenticated') {
        router.push('/auth/signin?callbackUrl=/perfil')
        return null
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-800 border-t-red-600 rounded-full animate-spin" />
            </div>
        )
    }

    const handleDeleteAccount = async () => {
        if (!confirm('¿Estás SEGURO de que quieres eliminar tu cuenta? Esta acción es irreversible y perderás todos tus datos, historial de pedidos y análisis de estilo.')) {
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/user/delete', { method: 'DELETE' })
            if (!res.ok) throw new Error('Error al eliminar cuenta')

            toast.success('Cuenta eliminada correctamente')
            signOut({ callbackUrl: '/' })
        } catch (error) {
            toast.error('Ocurrió un error al intentar eliminar tu cuenta')
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'general', label: 'General', icon: User },
        { id: 'style', label: 'Mi Estilo & AI', icon: SparklesIcon },
        { id: 'orders', label: 'Historial', icon: ShoppingBag },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-800 bg-slate-800 flex items-center justify-center">
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || 'User'}
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-slate-500">
                                    {(session?.user?.name?.[0] || 'U').toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900" />
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white mb-1">
                            {session?.user?.name || 'Usuario'}
                        </h1>
                        <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" />
                            {session?.user?.email}
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-slate-700">
                                Miembro desde 2024
                            </span>
                            {session?.user?.role === 'ADMIN' && (
                                <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/20">
                                    Admin
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center gap-2 font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-3 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === tab.id
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-medium'
                                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'general' && (
                                    <div className="space-y-6">
                                        <StatsCards />
                                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                            <h3 className="text-xl font-bold text-white mb-4">Información Personal</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InfoItem label="Nombre" value={session?.user?.name || '-'} />
                                                <InfoItem label="Email" value={session?.user?.email || '-'} />
                                                <InfoItem label="Rol" value={session?.user?.role || 'User'} />
                                                <InfoItem label="Idioma Prefe" value="Español" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'style' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Link href="/closet" className="group">
                                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-full hover:border-red-500/50 transition-colors">
                                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Shirt className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Mi Closet Inteligente</h3>
                                                <p className="text-slate-400 mb-4">Gestiona tus prendas digitales y escanea nueva ropa.</p>
                                                <span className="text-purple-400 text-sm font-medium flex items-center gap-1">
                                                    Ir al closet <ChevronRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </Link>

                                        <Link href="/outfits" className="group">
                                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-full hover:border-red-500/50 transition-colors">
                                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <SparklesIcon className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Generador de Outfits</h3>
                                                <p className="text-slate-400 mb-4">Crea combinaciones perfectas con AI basadas en tu estilo.</p>
                                                <span className="text-blue-400 text-sm font-medium flex items-center gap-1">
                                                    Crear outfit <ChevronRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-2">Análisis de Colorimetría</h3>
                                                    <p className="text-slate-300 max-w-lg">
                                                        Descubre qué colores te favorecen según tu tono de piel y características únicas.
                                                    </p>
                                                </div>
                                                <Palette className="w-8 h-8 text-slate-500" />
                                            </div>
                                            <div className="mt-6">
                                                <Link href="/closet">
                                                    <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                                                        Ver mi análisis
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center">
                                        <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Historial de Pedidos</h3>
                                        <p className="text-slate-400 mb-6">Revisa el estado de tus compras recientes.</p>
                                        <Link href="/mis-ordenes">
                                            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
                                                Ver Todos los Pedidos
                                            </button>
                                        </Link>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                            <h3 className="text-xl font-bold text-white mb-4">Preferencias</h3>
                                            <div className="flex items-center justify-between py-4 border-b border-slate-800/50">
                                                <div>
                                                    <p className="text-white font-medium">Newsletter</p>
                                                    <p className="text-slate-400 text-sm">Recibir correos sobre ofertas y novedades</p>
                                                </div>
                                                <div className="w-12 h-6 bg-green-500/20 rounded-full relative cursor-pointer border border-green-500/30">
                                                    <div className="absolute right-1 top-1 w-4 h-4 bg-green-500 rounded-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                                            <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                                                <Trash2 className="w-5 h-5" />
                                                Zona de Peligro
                                            </h3>
                                            <p className="text-red-400/80 mb-6 text-sm">
                                                Si eliminas tu cuenta, perderás acceso a todos tus pedidos, historial y datos guardados. Esta acción no se puede deshacer.
                                            </p>
                                            <button
                                                onClick={handleDeleteAccount}
                                                disabled={isLoading}
                                                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold transition-all w-full sm:w-auto"
                                            >
                                                {isLoading ? 'Eliminando...' : 'Eliminar mi cuenta permanentemente'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

function StatsCards() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={ShoppingBag} label="Pedidos" value="0" color="blue" />
            <StatCard icon={HeartIcon} label="Favoritos" value="0" color="pink" />
            <StatCard icon={Shirt} label="Closet Items" value="0" color="purple" />
            <StatCard icon={Star} label="Reseñas" value="0" color="yellow" />
        </div>
    )
}

function StatCard({ icon: Icon, label, value, color }: any) {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    }

    return (
        <div className={`p-4 rounded-2xl border ${colors[color as keyof typeof colors]} flex flex-col items-center justify-center text-center`}>
            <Icon className="w-6 h-6 mb-2 opacity-80" />
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-xs opacity-70 font-medium uppercase tracking-wider">{label}</span>
        </div>
    )
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <span className="text-slate-500 text-sm block mb-1">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    )
}

// Icons
function SparklesIcon(props: any) {
    return <Sparkles {...props} />
}

import { Sparkles, Heart as HeartIcon } from 'lucide-react'
