/**
 * Bitcoin Payment Loading Component
 * Skeleton loader con animaciones para checkout
 */

'use client'

import { motion } from 'framer-motion'
import { Bitcoin, Loader2 } from 'lucide-react'

export default function PaymentLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-12 text-center max-w-md w-full"
            >
                {/* Animated Bitcoin Icon */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 mb-6"
                >
                    <Bitcoin className="w-10 h-10 text-white" />
                </motion.div>

                {/* Loading Text */}
                <h2 className="text-2xl font-black text-white mb-2">
                    Procesando pago...
                </h2>
                <p className="text-slate-400 mb-6">
                    Por favor espera mientras preparamos tu pago con Bitcoin
                </p>

                {/* Animated Loader */}
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                    <span className="text-slate-300 text-sm">Esto puede tomar unos segundos</span>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-2 h-2 rounded-full bg-orange-500"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
