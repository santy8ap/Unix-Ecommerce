'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send, Sparkles, User, Bot, Loader2, Zap,
    Image as ImageIcon, X, Upload
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    image?: string
}

interface AIStylingChatProps {
    onOutfitGenerated?: (outfitId: string) => void
}

export default function AIStylingChat({ onOutfitGenerated }: AIStylingChatProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [detectedPreferences, setDetectedPreferences] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (!session) return

        setMessages([{
            role: 'assistant',
            content: `¡Hola ${session.user?.name}! 👋 Soy **UNIX AI**, tu asistente personal de moda.

Estoy aquí para ayudarte a descubrir tu estilo único y crear outfits increíbles. 

¿Qué tal si comenzamos? Cuéntame:
- ¿Qué estilo de ropa te gusta? (casual, streetwear, anime, vintage, etc.)
- ¿Hay algún personaje o aesthetic que te inspire?
- ¿Para qué ocasión necesitas un outfit?

También puedes **subir fotos** 📸 de outfits que te gusten para que los analice.`,
            timestamp: new Date()
        }])
    }, [session])

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no puede ser mayor a 5MB')
            return
        }

        setSelectedImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || loading) return

        const userMessage: Message = {
            role: 'user',
            content: input || '📸 [Imagen adjunta]',
            timestamp: new Date(),
            image: imagePreview || undefined
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            // Si hay imagen, primero  analizarla
            if (selectedImage) {
                const imageFormData = new FormData()
                imageFormData.append('image', selectedImage)
                imageFormData.append('context', 'outfit')

                const imageRes = await fetch('/api/ai/analyze-image', {
                    method: 'POST',
                    body: imageFormData
                })

                if (!imageRes.ok) throw new Error('Error analizando imagen')

                const imageData = await imageRes.json()

                const imageAnalysisMessage: Message = {
                    role: 'assistant',
                    content: `📸 **Análisis de la imagen**:\n\n${imageData.analysis.description}`,
                    timestamp: new Date()
                }

                setMessages(prev => [...prev, imageAnalysisMessage])
                removeImage()

                // Si también hay texto, continuar con el chat normal
                if (!input.trim()) {
                    setLoading(false)
                    return
                }
            }

            // Chat normal
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            })

            if (!res.ok) throw new Error('Error en la respuesta')

            const data = await res.json()

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])

            if (data.detectedPreferences?.length > 0) {
                setDetectedPreferences(prev =>
                    [...new Set([...prev, ...data.detectedPreferences])]
                )
            }

        } catch (error) {
            toast.error('Error al enviar mensaje')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateOutfit = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/ai/outfits/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    occasion: 'casual',
                    season: 'all-season',
                    preferences: detectedPreferences,
                    useClosetItems: true
                })
            })

            if (!res.ok) throw new Error('Error generando outfit')

            const data = await res.json()

            const outfitMessage: Message = {
                role: 'assistant',
                content: `🎨 ¡Perfecto! He creado un outfit especial para ti:

**${data.details.outfitName}**
${data.details.description}

**Vibe**: ${data.details.vibe}

**Prendas seleccionadas**:
${data.details.items.map((item: any, idx: number) =>
                    `${idx + 1}. **${item.name}** (${item.category}) - ${item.why}`
                ).join('\n')}

**Tips de estilo**: ${data.details.stylingTips}

¿Te gusta este outfit? Puedes guardarlo en tu colección o pedirme que genere otro diferente. 😊`,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, outfitMessage])

            if (onOutfitGenerated) {
                onOutfitGenerated(data.outfit.id)
            }

            toast.success('¡Outfit generado! 🎉')

        } catch (error) {
            toast.error('Error al generar outfit')
        } finally {
            setLoading(false)
        }
    }

    const suggestedQuestions = [
        "Me encanta el anime, especialmente Attack on Titan",
        "Quiero un look streetwear oversized",
        "Busco algo casual para universidad",
        "¿Qué colores me quedan bien?"
    ]

    if (!session) {
        return (
            <div className="flex items-center justify-center p-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="text-center">
                    <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Inicia sesión para chatear</h3>
                    <p className="text-slate-400 mb-6">
                        Necesitas una cuenta para usar el asistente de IA
                    </p>
                    <Link
                        href="/auth/signin"
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold inline-block hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[700px] bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white">UNIX AI Stylist</h3>
                    <p className="text-xs text-slate-400">Tu asistente personal de moda</p>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400">Online</span>
                </div>
            </div>

            {/* Preferences Pills */}
            {detectedPreferences.length > 0 && (
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500">Preferencias detectadas:</span>
                        {detectedPreferences.map((pref, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20"
                            >
                                {pref}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                                {message.image && (
                                    <div className="mb-2 rounded-xl overflow-hidden">
                                        <Image
                                            src={message.image}
                                            alt="Uploaded"
                                            width={200}
                                            height={200}
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div
                                    className={`p-3 rounded-2xl ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                            : 'bg-slate-800 text-slate-200'
                                        }`}
                                >
                                    <div
                                        className="text-sm leading-relaxed whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{
                                            __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 mt-1 block px-2">
                                    {message.timestamp.toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-slate-300" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                        </div>
                        <div className="bg-slate-800 p-3 rounded-2xl">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length > 2 && !loading && (
                <div className="px-4 py-2 border-t border-slate-800">
                    <button
                        onClick={handleGenerateOutfit}
                        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        Generar Outfit Ahora
                    </button>
                </div>
            )}

            {/* Suggested Questions */}
            {messages.length === 1 && !loading && (
                <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/30">
                    <p className="text-xs text-slate-500 mb-2">Sugerencias:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => setInput(q)}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
                <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/30">
                    <div className="relative inline-block">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            <X className="w-3 h-3 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"
                        title="Subir imagen"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe tu mensaje..."
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={(!input.trim() && !selectedImage) || loading}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
