/**
 * Payment Service
 * Main payment orchestration service
 */

import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email/mailer'
import type { PaymentIntent, PaymentResult, PaymentMethod } from './types'
import { PAYMENT_METHODS } from './config'
import { createPayPalOrder, capturePayPalOrder } from './paypal'
import { createStripePayment, retrieveStripePayment } from './stripe'
import { createCryptoCharge, retrieveCryptoCharge } from './crypto'

/**
 * Process payment based on selected method
 */
export async function processPayment(
    method: PaymentMethod,
    paymentIntent: PaymentIntent
): Promise<any> {
    switch (method) {
        case PAYMENT_METHODS.PAYPAL:
            return await createPayPalOrder(paymentIntent)

        case PAYMENT_METHODS.STRIPE:
            return await createStripePayment(paymentIntent)

        case PAYMENT_METHODS.CRYPTO:
            return await createCryptoCharge(paymentIntent)

        default:
            throw new Error(`Unsupported payment method: ${method}`)
    }
}

/**
 * Verify payment completion
 */
export async function verifyPayment(
    method: PaymentMethod,
    transactionId: string
): Promise<PaymentResult> {
    switch (method) {
        case PAYMENT_METHODS.PAYPAL:
            return await capturePayPalOrder(transactionId)

        case PAYMENT_METHODS.STRIPE:
            return await retrieveStripePayment(transactionId)

        case PAYMENT_METHODS.CRYPTO:
            return await retrieveCryptoCharge(transactionId)

        default:
            throw new Error(`Unsupported payment method: ${method}`)
    }
}

/**
 * Create order after successful payment
 */
export async function createOrderFromPayment(
    userId: string,
    paymentIntent: PaymentIntent,
    paymentResult: PaymentResult,
    paymentMethod: PaymentMethod
): Promise<{ orderId: string }> {
    // Create order in database
    const order = await prisma.order.create({
        data: {
            userId,
            total: paymentIntent.total,
            status: 'COMPLETED',
            shippingName: paymentIntent.shipping.name,
            shippingEmail: paymentIntent.shipping.email,
            shippingAddress: paymentIntent.shipping.address,
            shippingCity: paymentIntent.shipping.city,
            shippingZip: paymentIntent.shipping.zip,
            items: {
                create: paymentIntent.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color,
                })),
            },
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    })

    // Update product stock
    for (const item of paymentIntent.items) {
        await prisma.product.update({
            where: { id: item.productId },
            data: {
                stock: {
                    decrement: item.quantity,
                },
            },
        })
    }

    // Send confirmation email
    try {
        await sendOrderConfirmation({
            orderId: order.id,
            customerName: order.shippingName,
            customerEmail: order.shippingEmail,
            total: order.total,
            items: order.items,
            shippingAddress: {
                name: order.shippingName,
                address: order.shippingAddress,
                city: order.shippingCity,
                zip: order.shippingZip,
            },
        })
    } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError)
        // Don't fail the order creation if email fails
    }

    return { orderId: order.id }
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: PaymentIntent['items']): {
    subtotal: number
    tax: number
    total: number
} {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )
    const tax = subtotal * 0.09 // 9% tax
    const total = subtotal + tax

    return {
        subtotal,
        tax,
        total,
    }
}
