'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Image as ImageIcon } from 'lucide-react'
import ImageUpload from '../shared/ImageUpload'

interface ProductImageUploadProps {
    images: string[]
    onChange: (urls: string[]) => void
    error?: string
    touched?: boolean
}

export default function ProductImageUpload({
    images,
    onChange,
    error,
    touched
}: ProductImageUploadProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-base font-black text-white">Imágenes del Producto</h3>
                    <p className="text-xs text-slate-400">Sube imágenes de alta calidad de tu producto</p>
                </div>
            </div>

            <ImageUpload
                value={images}
                onChange={onChange}
                maxFiles={8}
            />

            {touched && error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-400 flex items-center gap-1 font-medium"
                >
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </motion.p>
            )}
        </motion.div>
    )
}
