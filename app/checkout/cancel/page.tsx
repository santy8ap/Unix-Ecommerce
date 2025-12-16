'use client'

import { motion } from 'framer-motion'
import { XCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutCancelPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/10 to-slate-950">
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-12 text-center"
                    >
                        {/* Cancel Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-6 shadow-lg shadow-red-500/30"
                        >
                            <XCircle className="w-12 h-12 text-white" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-black text-white mb-4"
                        >
                            Pago Cancelado
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300 text-lg mb-8"
                        >
                            No te preocupes, tu pago no fue procesado.
                            Puedes intentar de nuevo cuando estés listo.
                        </motion.p>

                        {/* Info Box */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8"
                        >
                            <p className="text-yellow-300 text-sm">
                                ℹ️ <strong>Razones comunes:</strong>
                            </p>
                            <ul className="text-left text-yellow-200 text-sm mt-3 space-y-2">
                                <li>• Cancelaste el pago manualmente</li>
                                <li>• El tiempo de pago expiró</li>
                                <li>• Cerraste la ventana de pago</li>
                                <li>• Problemas con tu billetera crypto</li>
                            </ul>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                onClick={() => router.push('/checkout')}
                                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Intentar de Nuevo
                            </button>
                            <Link href="/" className="flex-1">
                                <button className="w-full border-2 border-slate-700 text-slate-300 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Volver al Inicio
                                </button>
                            </Link>
                        </motion.div>

                        {/* Back to cart */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-6"
                        >
                            <button
                                onClick={() => router.back()}
                                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver atrás
                            </button>
                        </motion.div>

                        {/* Help */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                        >
                            <p className="text-sm text-blue-300">
                                ¿Necesitas ayuda? Contáctanos en{' '}
                                <a href="mailto:soporte@redestampacion.com" className="underline font-bold">
                                    soporte@redestampacion.com
                                </a>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
