'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Ruler, Palette } from 'lucide-react'

interface ProductAttributesProps {
    formData: {
        sizes: string[]
        colors: string[]
    }
    toggleSize: (size: string) => void
    toggleColor: (color: string) => void
    errors: Record<string, string>
    touched: Record<string, boolean>
    sizes: string[]
    colors: string[]
}

export default function ProductAttributes({
    formData,
    toggleSize,
    toggleColor,
    errors,
    touched,
    sizes,
    colors
}: ProductAttributesProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 bg-pink-500/20 border border-pink-500/30 rounded-xl flex items-center justify-center">
                    <Palette className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                    <h3 className="text-base font-black text-white">Variantes</h3>
                    <p className="text-xs text-slate-400">Gestiona tallas y colores del producto</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-sm font-black text-white mb-4">
                        <Ruler className="w-4 h-4 text-indigo-400" />
                        Tallas Disponibles
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {sizes.map(size => (
                            <motion.button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-3.5 rounded-xl text-sm font-black transition-all ${formData.sizes.includes(size)
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800'
                                    }`}
                            >
                                {size}
                            </motion.button>
                        ))}
                    </div>
                    {touched.sizes && errors.sizes && (
                        <p className="text-xs text-red-400 mt-3 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            {errors.sizes}
                        </p>
                    )}
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-black text-white mb-4">
                        <Palette className="w-4 h-4 text-purple-400" />
                        Colores Disponibles
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {colors.map(color => (
                            <motion.button
                                key={color}
                                type="button"
                                onClick={() => toggleColor(color)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-3.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${formData.colors.includes(color)
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
                                    }`}
                            >
                                <span
                                    className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                                    style={{ backgroundColor: color.toLowerCase() === 'blanco' ? '#ffffff' : color.toLowerCase() === 'negro' ? '#000000' : color.toLowerCase() }}
                                />
                                {color}
                            </motion.button>
                        ))}
                    </div>
                    {touched.colors && errors.colors && (
                        <p className="text-xs text-red-400 mt-3 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            {errors.colors}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
