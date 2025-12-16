'use client'

import { useState, useEffect } from 'react'
import { Clock, Zap, Flame } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface FlashSaleProps {
    productId: string
    originalPrice: number
    salePrice: number
    endsAt: string
    stockRemaining: number
}

export default function FlashSale({
    productId,
    originalPrice,
    salePrice,
    endsAt,
    stockRemaining,
}: FlashSaleProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const end = new Date(endsAt).getTime()
            const distance = end - now

            if (distance < 0) {
                clearInterval(timer)
                return
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [endsAt])

    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100)

    return (
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-pink-600 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                {/* Flash Sale Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                    </motion.div>
                    <h3 className="text-2xl font-black uppercase tracking-wide">
                        ¡Oferta Relámpago!
                    </h3>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    >
                        <Flame className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                    </motion.div>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Termina en:</span>
                    <div className="flex gap-2 ml-2">
                        {[
                            { value: timeLeft.hours, label: 'H' },
                            { value: timeLeft.minutes, label: 'M' },
                            { value: timeLeft.seconds, label: 'S' },
                        ].map((unit, idx) => (
                            <div
                                key={idx}
                                className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg"
                            >
                                <span className="font-black text-xl">
                                    {String(unit.value).padStart(2, '0')}
                                </span>
                                <span className="text-xs ml-1 opacity-80">{unit.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-4 mb-4">
                    <div>
                        <p className="text-sm opacity-80 line-through">
                            ${originalPrice.toFixed(2)}
                        </p>
                        <p className="text-4xl font-black">
                            ${salePrice.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-yellow-300 text-red-900 px-4 py-2 rounded-xl font-black text-xl mb-1">
                        -{discount}%
                    </div>
                </div>

                {/* Stock Remaining */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Solo quedan {stockRemaining} unidades</span>
                        <span className="font-bold">{Math.round((stockRemaining / 100) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stockRemaining / 100) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400"
                        />
                    </div>
                </div>

                {/* CTA Button */}
                <Link
                    href={`/productos/${productId}`}
                    className="block w-full bg-white text-red-600 text-center py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition shadow-lg"
                >
                    ¡Aprovecha Ahora!
                </Link>
            </div>
        </div>
    )
}
