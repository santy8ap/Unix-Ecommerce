/**
 * Badge de Recomendación con IA
 * Muestra cuando un producto es recomendado basado en colorimetría/estilo del usuario
 */

'use client'

import { Sparkles, Palette, Shirt } from 'lucide-react'
import { motion } from 'framer-motion'

interface RecommendationBadgeProps {
    isRecommendedColor?: boolean
    isRecommendedStyle?: boolean
    className?: string
    variant?: 'compact' | 'full'
}

export default function RecommendationBadge({
    isRecommendedColor = false,
    isRecommendedStyle = false,
    className = '',
    variant = 'compact',
}: RecommendationBadgeProps) {
    if (!isRecommendedColor && !isRecommendedStyle) return null

    const isRecommended = isRecommendedColor || isRecommendedStyle

    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg ${className}`}
            >
                <Sparkles className="w-3.5 h-3.5" />
                Recomendado IA
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3 ${className}`}
        >
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-purple-300 mb-1">Recomendado para ti</div>
                    <div className="space-y-1">
                        {isRecommendedColor && (
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <Palette className="w-3.5 h-3.5 text-purple-400" />
                                <span>Colores que te favorecen</span>
                            </div>
                        )}
                        {isRecommendedStyle && (
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <Shirt className="w-3.5 h-3.5 text-pink-400" />
                                <span>Coincide con tu estilo</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
