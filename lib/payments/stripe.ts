/**
 * Stripe Payment Provider
 * Handles Stripe payment processing
 */

import Stripe from 'stripe'
import { PAYMENT_CONFIG, CURRENCY } from './config'
import type { PaymentIntent, PaymentResult } from './types'

// Initialize Stripe
const stripe = PAYMENT_CONFIG.stripe.secretKey
    ? new Stripe(PAYMENT_CONFIG.stripe.secretKey, {
        apiVersion: '2025-11-17.clover',
    })
    : null

/**
 * Create Stripe payment intent
 */
export async function createStripePayment(
    paymentIntent: PaymentIntent
): Promise<{ clientSecret: string; paymentIntentId: string }> {
    if (!stripe) {
        throw new Error('Stripe is not configured')
    }

    const amount = Math.round(paymentIntent.total * 100) // Convert to cents

    const stripePaymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: CURRENCY.toLowerCase(),
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            customerName: paymentIntent.shipping.name,
            customerEmail: paymentIntent.shipping.email,
            items: JSON.stringify(
                paymentIntent.items.map((item) => ({
                    id: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                }))
            ),
        },
        shipping: {
            name: paymentIntent.shipping.name,
            address: {
                line1: paymentIntent.shipping.address,
                city: paymentIntent.shipping.city,
                postal_code: paymentIntent.shipping.zip,
                country: 'US',
            },
        },
        receipt_email: paymentIntent.shipping.email,
    })

    return {
        clientSecret: stripePaymentIntent.client_secret!,
        paymentIntentId: stripePaymentIntent.id,
    }
}

/**
 * Retrieve Stripe payment intent
 */
export async function retrieveStripePayment(
    paymentIntentId: string
): Promise<PaymentResult> {
    if (!stripe) {
        throw new Error('Stripe is not configured')
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
        return {
            success: true,
            transactionId: paymentIntent.id,
            metadata: {
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                paymentMethod: paymentIntent.payment_method,
            },
        }
    }

    return {
        success: false,
        error: `Stripe payment not completed. Status: ${paymentIntent.status}`,
    }
}

/**
 * Verify Stripe webhook signature
 */
export async function verifyStripeWebhook(
    payload: string | Buffer,
    signature: string
): Promise<Stripe.Event> {
    if (!stripe || !PAYMENT_CONFIG.stripe.webhookSecret) {
        throw new Error('Stripe webhook is not configured')
    }

    return stripe.webhooks.constructEvent(
        payload,
        signature,
        PAYMENT_CONFIG.stripe.webhookSecret
    )
}

/**
 * Create Stripe checkout session (alternative payment method)
 */
export async function createStripeCheckoutSession(
    paymentIntent: PaymentIntent,
    successUrl: string,
    cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
    if (!stripe) {
        throw new Error('Stripe is not configured')
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: paymentIntent.items.map((item) => ({
            price_data: {
                currency: CURRENCY.toLowerCase(),
                product_data: {
                    name: item.name,
                    description: `${item.size} - ${item.color}`,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: paymentIntent.shipping.email,
        metadata: {
            customerName: paymentIntent.shipping.name,
        },
    })

    return {
        sessionId: session.id,
        url: session.url!,
    }
}
