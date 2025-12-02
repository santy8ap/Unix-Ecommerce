/**
 * Stripe Payment Component
 * Renders Stripe payment form
 */

'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import { PAYMENT_CONFIG } from '@/lib/payments/config'
import type { PaymentIntent } from '@/lib/payments/types'

const stripePromise = PAYMENT_CONFIG.stripe.publishableKey
    ? loadStripe(PAYMENT_CONFIG.stripe.publishableKey)
    : null

interface StripePaymentFormProps {
    clientSecret: string
    paymentIntent: PaymentIntent
    onSuccess: (transactionId: string) => void
    onError: (error: string) => void
}

function StripePaymentForm({
    clientSecret,
    paymentIntent,
    onSuccess,
    onError,
}: StripePaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsProcessing(true)

        try {
            // Confirm payment
            const { error, paymentIntent: stripePaymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            })

            if (error) {
                throw new Error(error.message)
            }

            if (stripePaymentIntent?.status === 'succeeded') {
                // Capture payment in our system
                const response = await fetch('/api/payments/capture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method: 'stripe',
                        transactionId: stripePaymentIntent.id,
                        items: paymentIntent.items,
                        shipping: paymentIntent.shipping,
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to process payment')
                }

                const result = await response.json()
                onSuccess(result.transactionId)
            } else {
                throw new Error('Payment failed')
            }
        } catch (error: any) {
            onError(error.message || 'Error processing payment')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-lg font-bold text-lg transition hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Procesando...
                    </>
                ) : (
                    `Pagar $${paymentIntent.total.toFixed(2)}`
                )}
            </button>
        </form>
    )
}

interface StripePaymentProps {
    paymentIntent: PaymentIntent
    onSuccess: (transactionId: string) => void
    onError: (error: string) => void
}

export default function StripePayment({
    paymentIntent,
    onSuccess,
    onError,
}: StripePaymentProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const initializePayment = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'stripe',
                    items: paymentIntent.items,
                    shipping: paymentIntent.shipping,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to initialize Stripe payment')
            }

            const data = await response.json()
            setClientSecret(data.data.clientSecret)
        } catch (error: any) {
            toast.error(error.message || 'Error initializing payment')
            onError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!stripePromise) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">Stripe no está configurado</p>
            </div>
        )
    }

    if (!clientSecret) {
        return (
            <div className="text-center">
                <button
                    onClick={initializePayment}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
                >
                    {isLoading ? 'Cargando...' : 'Continuar con Tarjeta'}
                </button>
            </div>
        )
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#9333ea',
                    },
                },
            }}
        >
            <StripePaymentForm
                clientSecret={clientSecret}
                paymentIntent={paymentIntent}
                onSuccess={onSuccess}
                onError={onError}
            />
        </Elements>
    )
}
