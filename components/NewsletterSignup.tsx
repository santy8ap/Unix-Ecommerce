'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface NewsletterSignupProps {
    variant?: 'footer' | 'modal' | 'inline'
}

export default function NewsletterSignup({ variant = 'footer' }: NewsletterSignupProps) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, source: variant.toUpperCase() }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Error al suscribirse')
            }

            setSuccess(true)
            toast.success('¡Suscripción exitosa! Revisa tu email para confirmar.')
            setEmail('')
            setName('')
        } catch (error: any) {
            toast.error(error.message || 'Error al suscribirse')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-green-50 rounded-xl border border-green-200"
            >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900 mb-2">
                    ¡Gracias por suscribirte!
                </h3>
                <p className="text-green-700">
                    Revisa tu email para confirmar tu suscripción
                </p>
            </motion.div>
        )
    }

    if (variant === 'footer') {
        return (
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Newsletter
                </h3>
                <p className="text-sm mb-4 text-slate-500">
                    Suscríbete para recibir ofertas exclusivas y novedades
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Tu email"
                        className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {loading ? 'Suscribiendo...' : 'Suscribirse'}
                    </button>
                </form>
            </div>
        )
    }

    if (variant === 'inline') {
        return (
            <div className="w-full">
                <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre"
                        className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none backdrop-blur-sm"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none backdrop-blur-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {loading ? '...' : 'Suscribirse'}
                    </button>
                </form>
                <p className="text-xs text-slate-400 mt-4 text-center">
                    Respetamos tu privacidad. Sin spam, nunca.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl shadow-indigo-500/20">
            <div className="max-w-2xl mx-auto text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 text-white/90" />
                <h3 className="text-3xl font-black mb-2 tracking-tight">
                    ¡Mantente al día!
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-8">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-white/50 focus:outline-none border-0 shadow-inner"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Tu email"
                        className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:ring-2 focus:ring-white/50 focus:outline-none border-0 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 whitespace-nowrap shadow-lg"
                    >
                        {loading ? 'Enviando...' : 'Suscribirse'}
                    </button>
                </form>
            </div>
        </div>
    )
}
