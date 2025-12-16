/**
 * Crypto Payment Component
 * Renders cryptocurrency payment interface (Coinbase Commerce)
 */

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Bitcoin, ExternalLink, Loader2 } from 'lucide-react'
import type { PaymentIntent } from '@/lib/services/payments/types'

interface CryptoPaymentProps {
    paymentIntent: PaymentIntent
    onSuccess: (transactionId: string) => void
    onError: (error: string) => void
}

const SUPPORTED_CRYPTOS = [
    { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    { name: 'USD Coin', symbol: 'USDC', icon: '$' },
    { name: 'Litecoin', symbol: 'LTC', icon: 'Ł' },
]

export default function CryptoPayment({
    paymentIntent,
    onSuccess,
    onError,
}: CryptoPaymentProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
    const [chargeCode, setChargeCode] = useState<string | null>(null)

    const initializePayment = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'crypto',
                    items: paymentIntent.items,
                    shipping: paymentIntent.shipping,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to initialize crypto payment')
            }

            const data = await response.json()
            setCheckoutUrl(data.data.hostedUrl)
            setChargeCode(data.data.code)

            // Open Coinbase Commerce checkout in new window
            window.open(data.data.hostedUrl, '_blank', 'width=800,height=600')

            // Start polling for payment status
            pollPaymentStatus(data.data.chargeId)
        } catch (error: any) {
            toast.error(error.message || 'Error initializing crypto payment')
            onError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const pollPaymentStatus = async (chargeId: string) => {
        const maxAttempts = 60 // Poll for 5 minutes (every 5 seconds)
        let attempts = 0

        const checkStatus = async () => {
            try {
                const response = await fetch('/api/payments/capture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method: 'crypto',
                        transactionId: chargeId,
                        items: paymentIntent.items,
                        shipping: paymentIntent.shipping,
                    }),
                })

                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        onSuccess(result.transactionId)
                        return true
                    }
                }

                attempts++
                if (attempts < maxAttempts) {
                    setTimeout(checkStatus, 5000) // Check every 5 seconds
                } else {
                    toast.warning('El pago está tomando más tiempo de lo esperado. Revisa tu email para confirmación.')
                }
            } catch (error) {
                console.error('Error checking crypto payment status:', error)
            }
        }

        checkStatus()
    }

    if (!checkoutUrl) {
        return (
            <div className="space-y-6">
                {/* Supported Cryptos */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Criptomonedas Aceptadas</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {SUPPORTED_CRYPTOS.map((crypto) => (
                            <div
                                key={crypto.symbol}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <span className="text-2xl">{crypto.icon}</span>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{crypto.name}</p>
                                    <p className="text-xs text-gray-600">{crypto.symbol}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Bitcoin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-orange-800">
                            <p className="font-semibold mb-1">Pago con Criptomonedas</p>
                            <ul className="list-disc list-inside space-y-1 text-orange-700">
                                <li>Transacción segura y anónima</li>
                                <li>Confirmación automática después del pago</li>
                                <li>Soporta Bitcoin, Ethereum, USDC y más</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={initializePayment}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-lg font-bold text-lg transition hover:from-orange-700 hover:to-orange-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Iniciando...
                        </>
                    ) : (
                        <>
                            <Bitcoin className="w-5 h-5" />
                            Pagar con Cripto ${paymentIntent.total.toFixed(2)}
                        </>
                    )}
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <Bitcoin className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <h4 className="font-bold text-green-900 mb-2">¡Ventana de pago abierta!</h4>
                <p className="text-green-700 text-sm mb-4">
                    Completa el pago en la ventana de Coinbase Commerce.
                    <br />
                    Automáticamente confirmaremos tu pedido cuando se complete el pago.
                </p>

                {/* Open again button */}
                <button
                    onClick={() => window.open(checkoutUrl, '_blank', 'width=800,height=600')}
                    className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold text-sm"
                >
                    <ExternalLink className="w-4 h-4" />
                    Abrir ventana de pago nuevamente
                </button>
            </div>

            {/* Waiting indicator */}
            <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Esperando confirmación del pago...</p>
                {chargeCode && (
                    <p className="text-sm text-gray-500 mt-2">Código de pago: {chargeCode}</p>
                )}
            </div>
        </div>
    )
}
