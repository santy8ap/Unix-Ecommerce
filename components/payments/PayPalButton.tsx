/**
 * PayPal Button Component
 * Renders PayPal payment button
 */

'use client'

import { useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { toast } from 'sonner'
import { PAYMENT_CONFIG } from '@/lib/payments/config'
import type { PaymentIntent } from '@/lib/payments/types'

interface PayPalButtonProps {
    paymentIntent: PaymentIntent
    onSuccess: (transactionId: string) => void
    onError: (error: string) => void
}

export default function PayPalButton({
    paymentIntent,
    onSuccess,
    onError,
}: PayPalButtonProps) {
    const clientId = PAYMENT_CONFIG.paypal.clientId

    if (!clientId) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">PayPal no está configurado</p>
            </div>
        )
    }

    return (
        <PayPalScriptProvider
            options={{
                clientId,
                currency: 'USD',
                intent: 'capture',
            }}
        >
            <div className="max-w-md mx-auto">
                <PayPalButtons
                    style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'paypal',
                    }}
                    createOrder={async () => {
                        try {
                            // Call our API to create PayPal order
                            const response = await fetch('/api/payments/create', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    method: 'paypal',
                                    items: paymentIntent.items,
                                    shipping: paymentIntent.shipping,
                                }),
                            })

                            if (!response.ok) {
                                throw new Error('Failed to create PayPal order')
                            }

                            const data = await response.json()
                            return data.data.orderId
                        } catch (error: any) {
                            toast.error(error.message || 'Error creating PayPal order')
                            throw error
                        }
                    }}
                    onApprove={async (data) => {
                        try {
                            // Capture the payment
                            const response = await fetch('/api/payments/capture', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    method: 'paypal',
                                    transactionId: data.orderID,
                                    items: paymentIntent.items,
                                    shipping: paymentIntent.shipping,
                                }),
                            })

                            if (!response.ok) {
                                throw new Error('Failed to capture PayPal payment')
                            }

                            const result = await response.json()
                            onSuccess(result.transactionId)
                        } catch (error: any) {
                            onError(error.message || 'Error processing PayPal payment')
                        }
                    }}
                    onError={(err) => {
                        console.error('PayPal error:', err)
                        onError('Error con PayPal. Por favor intenta de nuevo.')
                    }}
                    onCancel={() => {
                        toast.info('Pago cancelado')
                    }}
                />
            </div>
        </PayPalScriptProvider>
    )
}
