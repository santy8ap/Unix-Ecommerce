/**
 * Bitcoin Payment Provider via Coinbase Commerce
 * Handles Bitcoin and cryptocurrency payments
 */

import { PAYMENT_CONFIG, CURRENCY } from './config'
import type { PaymentIntent, PaymentResult, BitcoinCharge } from './types'

const COINBASE_API_BASE = 'https://api.commerce.coinbase.com'

/**
 * Create Bitcoin charge via Coinbase Commerce
 */
export async function createBitcoinCharge(
    paymentIntent: PaymentIntent
): Promise<{ chargeId: string; checkoutUrl: string }> {
    const apiKey = PAYMENT_CONFIG.bitcoin.apiKey

    if (!apiKey) {
        throw new Error('Coinbase Commerce API key not configured')
    }

    const chargeData = {
        name: 'Order Payment',
        description: `Payment for ${paymentIntent.items.length} item(s)`,
        pricing_type: 'fixed_price',
        local_price: {
            amount: paymentIntent.total.toFixed(2),
            currency: CURRENCY,
        },
        metadata: {
            customer_name: paymentIntent.shipping.name,
            customer_email: paymentIntent.shipping.email,
            orderId: paymentIntent.orderId,
            items: paymentIntent.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color,
            })),
            shipping: {
                address: paymentIntent.shipping.address,
                city: paymentIntent.shipping.city,
                zip: paymentIntent.shipping.zip,
            },
        },
        redirect_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
    }

    const response = await fetch(`${COINBASE_API_BASE}/charges`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CC-Api-Key': apiKey,
            'X-CC-Version': '2018-03-22',
        },
        body: JSON.stringify(chargeData),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Coinbase charge creation failed: ${error}`)
    }

    const data = await response.json()
    const charge: BitcoinCharge = data.data

    return {
        chargeId: charge.code,
        checkoutUrl: charge.hosted_url,
    }
}

/**
 * Get Bitcoin charge status
 */
export async function getBitcoinChargeStatus(
    chargeCode: string
): Promise<BitcoinCharge> {
    const apiKey = PAYMENT_CONFIG.bitcoin.apiKey

    if (!apiKey) {
        throw new Error('Coinbase Commerce API key not configured')
    }

    const response = await fetch(`${COINBASE_API_BASE}/charges/${chargeCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CC-Api-Key': apiKey,
            'X-CC-Version': '2018-03-22',
        },
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to get charge status: ${error}`)
    }

    const data = await response.json()
    return data.data
}

/**
 * Verify Coinbase Commerce webhook
 */
export async function verifyCoinbaseWebhook(
    headers: Record<string, string>,
    body: string
): Promise<boolean> {
    try {
        const webhookSecret = PAYMENT_CONFIG.bitcoin.webhookSecret

        if (!webhookSecret) {
            console.warn('Coinbase Commerce webhook secret not configured')
            return false
        }

        const signature = headers['x-cc-webhook-signature']

        if (!signature) {
            return false
        }

        // Use crypto module to verify HMAC signature
        const crypto = require('crypto')
        const hmac = crypto.createHmac('sha256', webhookSecret)
        hmac.update(body)
        const computedSignature = hmac.digest('hex')

        return signature === computedSignature
    } catch (error) {
        console.error('Error verifying Coinbase webhook:', error)
        return false
    }
}

/**
 * Capture/Complete Bitcoin payment
 */
export async function captureBitcoinPayment(
    chargeCode: string
): Promise<PaymentResult> {
    try {
        const charge = await getBitcoinChargeStatus(chargeCode)

        // Check charge timeline for completed status
        const latestStatus = charge.timeline[charge.timeline.length - 1]

        if (
            latestStatus.status === 'COMPLETED' ||
            latestStatus.status === 'RESOLVED'
        ) {
            return {
                success: true,
                transactionId: charge.code,
                metadata: {
                    chargeId: charge.id,
                    pricing: charge.pricing,
                    timeline: charge.timeline,
                },
            }
        }

        return {
            success: false,
            error: `Payment not completed. Status: ${latestStatus.status}`,
        }
    } catch (error) {
        console.error('Error capturing Bitcoin payment:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
