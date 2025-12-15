/**
 * 🤖 AI Style Assistant - Chat Interactivo para Onboarding
 * Conversación natural con IA para descubrir el estilo del usuario
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
}

interface StyleAssistantProps {
    onComplete: (data: { skinTone: string; styleType: string; preferences: any }) => void
}

export default function AIStyleAssistant({ onComplete }: StyleAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '¡Hola! 👋 Soy tu asis tente de moda con IA. Voy a ayudarte a descubrir tu estilo único y los colores que más te favorecen. ¿Empezamos?',
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [conversationStep, setConversationStep] = useState(0)
    const [collectedData, setCollectedData] = useState<any>({})
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const analyzeUserResponse = async (userMessage: string) => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai/chat-onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: messages,
                    currentStep: conversationStep,
                    collectedData,
                }),
            })

            if (!response.ok) throw new Error('Error en la respuesta')

            const data = await response.json()

            // Agregar respuesta de la IA
            const aiMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, aiMessage])

            // Actualizar datos recopilados
            if (data.extractedData) {
                setCollectedData((prev: any) => ({ ...prev, ...data.extractedData }))
            }

            // Avanzar paso si es necesario
            if (data.nextStep !== undefined) {
                setConversationStep(data.nextStep)
            }

            // Si la conversación terminó, finalizar onboarding
            if (data.completed) {
                setTimeout(() => {
                    onComplete({
                        skinTone: data.finalData.skinTone,
                        styleType: data.finalData.styleType,
                        preferences: data.finalData,
                    })
                }, 1500)
            }
        } catch (error) {
            console.error('Error:', error)
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Lo siento, hubo un error. ¿Podrías repetir eso?',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSend = () => {
        if (!input.trim() || isLoading) return

        // Agregar mensaje del usuario
        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        setInput('')

        // Procesar respuesta
        analyzeUserResponse(input)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const quickReplies = conversationStep === 0 ? ['Sí, ¡empecemos!', 'Cuéntame  más'] : []

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative w-full max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
                        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span className="text-sm font-bold text-purple-300">AI Style Assistant</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Descubre tu Estilo Único</h1>
                    <p className="text-slate-400">Conversación con IA • Powered by Gemini</p>
                </motion.div>

                {/* Chat Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Messages */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                                ? 'bg-gradient-to-br from-red-500 to-red-600'
                                                : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <User className="w-5 h-5 text-white" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div
                                        className={`max-w-[70%] px-4 py-3 rounded-2xl ${message.role === 'user'
                                                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                                                : 'bg-slate-800 text-slate-100'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        <span className="text-[10px] opacity-50 mt-1 block">
                                            {message.timestamp.toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-slate-800 px-4 py-3 rounded-2xl flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                                        <span className="text-sm text-slate-400">Pensando...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {quickReplies.length > 0 && !isLoading && (
                        <div className="px-6 pb-4 flex flex-wrap gap-2">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setInput(reply)
                                        setTimeout(handleSend, 100)
                                    }}
                                    className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/20 transition-all"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="border-t border-slate-800 p-4">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu respuesta..."
                                disabled={isLoading}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                <span className="hidden sm:inline">Enviar</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            Presiona Enter para enviar • Shift+Enter para nueva línea
                        </p>
                    </div>
                </motion.div>

                {/* Progress indicator */}
                <div className="mt-6 flex justify-center gap-2">
                    {[0, 1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`h-1 rounded-full transition-all duration-500 ${step <= conversationStep
                                    ? 'w-12 bg-gradient-to-r from-purple-500 to-pink-500'
                                    : 'w-8 bg-slate-800'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
