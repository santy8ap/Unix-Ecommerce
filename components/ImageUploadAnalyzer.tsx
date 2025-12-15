/**
 * 📸 Image Upload & Analysis Component
 * Drag & drop inteligente con análisis de IA
 */

'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, X, Loader2, Check, Sparkles, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
    analysisType: 'skin-tone' | 'clothing' | 'outfit' | 'palette'
    onAnalysisComplete: (result: any) => void
    title?: string
    description?: string
}

export default function ImageUploadAnalyzer({
    analysisType,
    onAnalysisComplete,
    title,
    description,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [result, setResult] = useState<any>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFile(files[0])
        }
    }, [])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFile = async (file: File) => {
        // Validar tipo
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor sube una imagen válida')
            return
        }

        // Validar tamaño
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen es demasiado grande (máx 5MB)')
            return
        }

        // Preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Analizar
        await analyzeImage(file)
    }

    const analyzeImage = async (file: File) => {
        setAnalyzing(true)

        try {
            const formData = new FormData()
            formData.append('image', file)
            formData.append('type', analysisType)

            const response = await fetch('/api/ai/analyze-image', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error en el análisis')
            }

            setResult(data.data)
            onAnalysisComplete(data.data)
            toast.success('¡Imagen analizada con IA!')
        } catch (error: any) {
            console.error('Error:', error)
            toast.error(error.message || 'Error analizando la imagen')
            setPreviewUrl(null)
        } finally {
            setAnalyzing(false)
        }
    }

    const reset = () => {
        setPreviewUrl(null)
        setResult(null)
    }

    const getTitle = () => {
        if (title) return title
        switch (analysisType) {
            case 'skin-tone':
                return 'Analiza tu Tono de Piel'
            case 'clothing':
                return 'Escanea tu Prenda'
            case 'outfit':
                return 'Analiza tu Outfit'
            case 'palette':
                return 'Extrae Colores'
        }
    }

    const getDescription = () => {
        if (description) return description
        switch (analysisType) {
            case 'skin-tone':
                return 'Sube una selfie con buena iluminación para análisis de colorimetría'
            case 'clothing':
                return 'Toma una foto de la prenda sobre fondo claro'
            case 'outfit':
                return 'Foto completa del outfit'
            case 'palette':
                return 'Sube cualquier imagen para extraer su paleta'
        }
    }

    return (
        <div className="w-full">
            {/* Upload Area */}
            <AnimatePresence mode="wait">
                {!previewUrl ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all ${isDragging
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-slate-700 bg-slate-900/50 hover:border-purple-500/50'
                            }`}
                    >
                        <div className="text-center">
                            {/* Icon */}
                            <motion.div
                                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                            >
                                {isDragging ? (
                                    <Upload className="w-10 h-10 text-white animate-bounce" />
                                ) : (
                                    <Camera className="w-10 h-10 text-white" />
                                )}
                            </motion.div>

                            {/* Text */}
                            <h3 className="text-2xl font-bold text-white mb-2">{getTitle()}</h3>
                            <p className="text-slate-400 mb-6">{getDescription()}</p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInput}
                                        className="hidden"
                                        disabled={analyzing}
                                    />
                                    <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all inline-flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Subir Imagen
                                    </div>
                                </label>

                                {/* Camera (solo en mobile) */}
                                <label className="cursor-pointer sm:hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileInput}
                                        className="hidden"
                                        disabled={analyzing}
                                    />
                                    <div className="px-6 py-3 rounded-xl border-2 border-purple-500 text-purple-300 font-bold hover:bg-purple-500/10 transition-all inline-flex items-center gap-2">
                                        <Camera className="w-5 h-5" />
                                        Tomar Foto
                                    </div>
                                </label>
                            </div>

                            <p className="text-xs text-slate-500 mt-4">
                                Formatos: JPG, PNG • Tamaño máx: 5MB
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative"
                    >
                        {/* Preview Card */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
                            {/* Image */}
                            <div className="relative aspect-video bg-slate-800">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                />

                                {/* Close button */}
                                {!analyzing && (
                                    <button
                                        onClick={reset}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                )}
                            </div>

                            {/* Status */}
                            <div className="p-6">
                                {analyzing ? (
                                    <div className="flex items-center gap-3 text-purple-300">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <div>
                                            <p className="font-bold">Analizando con IA...</p>
                                            <p className="text-sm text-slate-400">
                                                Powered by Gemini Vision
                                            </p>
                                        </div>
                                    </div>
                                ) : result ? (
                                    <div className="flex items-center gap-3 text-green-400">
                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                            <Check className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold">¡Análisis Completado!</p>
                                            <p className="text-sm text-slate-400">
                                                Resultados mostrados abajo
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            {result && <AnalysisResults data={result} type={analysisType} />}
        </div>
    )
}

/**
 * Component to display analysis results
 */
function AnalysisResults({ data, type }: { data: any; type: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Resultados del Análisis IA</h3>
            </div>

            {type === 'skin-tone' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800 rounded-xl p-4">
                            <p className="text-sm text-slate-400 mb-1">Tono de Piel</p>
                            <p className="text-lg font-bold text-white capitalize">{data.skinTone}</p>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-4">
                            <p className="text-sm text-slate-400 mb-1">Temporada</p>
                            <p className="text-lg font-bold text-white capitalize">{data.season}</p>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-4">
                            <p className="text-sm text-slate-400 mb-1">Subtono</p>
                            <p className="text-lg font-bold text-white capitalize">{data.undertone}</p>
                        </div>
                    </div>

                    {data.recommendations?.bestColors && (
                        <div>
                            <p className="text-sm font-bold text-slate-300 mb-2">Colores que te favorecen:</p>
                            <div className="flex flex-wrap gap-2">
                                {data.recommendations.bestColors.map((color: string, i: number) => (
                                    <div
                                        key={i}
                                        className="w-12 h-12 rounded-lg border-2 border-slate-700"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {type === 'clothing' && (
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-bold">
                            {data.category}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm font-bold">
                            {data.color}
                        </span>
                    </div>
                    <p className="text-slate-300">{data.description}</p>
                    {data.colors && (
                        <div className="flex gap-2">
                            {data.colors.map((color: string, i: number) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-slate-700"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {type === 'palette' && Array.isArray(data) && (
                <div className="flex flex-wrap gap-3">
                    {data.map((color: string, i: number) => (
                        <div key={i} className="text-center">
                            <div
                                className="w-16 h-16 rounded-xl border-2 border-slate-700 mb-2"
                                style={{ backgroundColor: color }}
                            />
                            <p className="text-xs text-slate-400 font-mono">{color}</p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}
