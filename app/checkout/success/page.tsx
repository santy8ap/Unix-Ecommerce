'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/useWindowSize'

function SuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { width, height } = useWindowSize()
    const [showConfetti, setShowConfetti] = useState(true)
    const orderId = searchParams.get('orderId')

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950">
            <Navbar />

            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-12 text-center"
                    >
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg shadow-green-500/50"
                        >
                            <CheckCircle className="w-12 h-12 text-white" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-black text-white mb-4"
                        >
                            ¡Pago Exitoso!
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300 text-lg mb-8"
                        >
                            Tu orden ha sido confirmada y está siendo procesada.
                            Recibirás un email de confirmación pronto.
                        </motion.p>

                        {/* Order ID */}
                        {orderId && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-8"
                            >
                                <p className="text-slate-400 text-sm mb-1">ID de Orden</p>
                                <p className="text-white font-mono font-bold">{orderId}</p>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/mis-ordenes" className="flex-1">
                                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Ver Mis Órdenes
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                            <Link href="/" className="flex-1">
                                <button className="w-full border-2 border-slate-700 text-slate-300 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Volver al Inicio
                                </button>
                            </Link>
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                        >
                            <p className="text-sm text-blue-300">
                                💡 <strong>Próximos pasos:</strong> Recibirás un email con los detalles de tu orden
                                y el tracking de envío en las próximas 24-48 horas.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950 flex items-center justify-center">
                <div className="text-white">Cargando...</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
