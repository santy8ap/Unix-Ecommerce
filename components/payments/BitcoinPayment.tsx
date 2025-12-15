/**
 * Bitcoin/Crypto Payment Component
 * Beautiful UI for Bitcoin payments via Coinbase Commerce
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, Loader2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface BitcoinPaymentProps {
    amount: number
    items: any[]
    shipping: any
    onSuccess: (transactionId: string) => void
    onCancel: () => void
    onBeforePayment?: () => Promise<string>
}

import QRCode from 'react-qr-code'
import { Copy, Check } from 'lucide-react'

export default function BitcoinPayment({
    amount,
    items,
    shipping,
    onSuccess,
    onCancel,
    onBeforePayment,
}: BitcoinPaymentProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
    const [chargeCode, setChargeCode] = useState<string | null>(null)
    const [status, setStatus] = useState<'idle' | 'checkout' | 'pending' | 'completed' | 'failed'>('idle')
    const [mode, setMode] = useState<'auto' | 'manual'>('auto')
    const [copied, setCopied] = useState(false)

    // Dirección fija del usuario
    const WALLET_ADDRESS = "bc1qrj4jc8tchx5uhgzvaf1qutxsxv6700s9zdh97"

    const createCharge = async () => {
        // ... (existing automated logic)
        setIsProcessing(true)
        setStatus('checkout')

        try {
            let orderId: string | undefined
            if (onBeforePayment) {
                orderId = await onBeforePayment()
            }

            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: 'bitcoin',
                    amount,
                    items,
                    shipping,
                    orderId,
                }),
            })

            if (!response.ok) throw new Error('Failed to create Bitcoin charge')

            const data = await response.json()
            setCheckoutUrl(data.checkoutUrl)
            setChargeCode(data.chargeId)
            window.open(data.checkoutUrl, '_blank', 'width=600,height=800')
            setStatus('pending')
            toast.success('Pago iniciado. Completa el pago en la ventana de Coinbase.')
            startPollingStatus(data.chargeId)
        } catch (error) {
            console.error('Error creating Bitcoin charge:', error)
            toast.error('Error al crear el pago con Bitcoin')
            setStatus('failed')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleManualPayment = async () => {
        setIsProcessing(true)
        try {
            if (onBeforePayment) {
                await onBeforePayment()
            }
            // Simulamos éxito pero con status pendiente de verificación
            toast.success('Pago registrado. Verificaremos la transacción pronto.')
            onSuccess('MANUAL_VERIFICATION')
        } catch (error) {
            toast.error('Error al registrar la orden')
        } finally {
            setIsProcessing(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(WALLET_ADDRESS)
        setCopied(true)
        toast.success('Dirección copiada')
        setTimeout(() => setCopied(false), 2000)
    }

    const startPollingStatus = async (code: string) => {
        // ... (Keep existing polling logic)
        const maxAttempts = 60
        let attempts = 0
        const pollInterval = setInterval(async () => {
            attempts++
            try {
                const response = await fetch(`/api/payments/capture`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ method: 'bitcoin', chargeCode: code }),
                })
                if (response.ok) {
                    const data = await response.json()
                    if (data.success) {
                        clearInterval(pollInterval)
                        setStatus('completed')
                        toast.success('¡Pago completado con éxito!')
                        onSuccess(data.transactionId)
                    }
                }
                if (attempts >= maxAttempts) {
                    clearInterval(pollInterval)
                    setStatus('failed')
                    toast.error('Tiempo de espera agotado.')
                }
            } catch (error) { console.error(error) }
        }, 5000)
    }

    if (status === 'completed') {
        // ... (Keep existing success UI)
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center"
            >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-green-900 mb-2">¡Pago Completado!</h3>
                <p className="text-green-700 mb-4">Tu pago ha sido procesado exitosamente</p>
            </motion.div>
        )
    }

    if (status === 'failed') {
        // ... (Keep existing failed UI)
        return (
            <motion.div className="bg-red-50 border-2 border-red-500 rounded-2xl p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-red-900 mb-2">Pago Fallido</h3>
                <button onClick={() => setStatus('idle')} className="px-4 py-2 bg-red-600 text-white rounded-lg">Intentar de Nuevo</button>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border text-center border-slate-200 shadow-xl rounded-2xl overflow-hidden"
        >
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 border-b border-orange-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 mb-3 shadow-lg shadow-orange-500/30">
                    <Bitcoin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Pagar con Bitcoin</h3>
            </div>

            <div className="p-6">
                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                    <button
                        onClick={() => setMode('auto')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'auto' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Coinbase (Auto)
                    </button>
                    <button
                        onClick={() => setMode('manual')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Billetera (Manual)
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-slate-500 mb-1">Total a Pagar</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        ${amount.toFixed(2)}
                    </p>
                </div>

                {mode === 'auto' ? (
                    <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-xl text-left">
                            <h4 className="font-bold text-orange-900 text-sm mb-1">Pago Automático</h4>
                            <p className="text-xs text-orange-800">
                                Usa Coinbase Commerce para pagar con BTC, ETH, USDC y más. Detección instantánea.
                            </p>
                        </div>

                        {status === 'pending' && (
                            <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                <div className="text-left">
                                    <p className="font-bold text-blue-900 text-sm">Esperando pago...</p>
                                    <p className="text-xs text-blue-700">Continúa en Coinbase</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={onCancel} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition">
                                Cancelar
                            </button>
                            <button
                                onClick={createCharge}
                                disabled={isProcessing || status === 'pending'}
                                className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pagar Ahora'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-200">
                            <QRCode value={WALLET_ADDRESS} size={160} />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-xs font-bold text-slate-500 uppercase">Dirección Billetera Bitcoin</label>
                            <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg border border-slate-200 group">
                                <code className="text-xs font-mono text-slate-700 break-all flex-1">
                                    {WALLET_ADDRESS}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-orange-600"
                                    title="Copiar"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl text-left">
                            <h4 className="font-bold text-blue-900 text-sm mb-1">Instrucciones</h4>
                            <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
                                <li>Envía el equivalente exacto a <strong>${amount.toFixed(2)} USD</strong> en Bitcoin.</li>
                                <li>Usa la red Bitcoin (BTC) nativa.</li>
                                <li>Haz clic en "Ya envié el pago" una vez confirmada la transacción en tu wallet.</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={onCancel} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition">
                                Cancelar
                            </button>
                            <button
                                onClick={handleManualPayment}
                                disabled={isProcessing}
                                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ya envié el pago'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
