/**
 * Crypto Payment Provider (Coinbase Commerce)
 * Handles Bitcoin and cryptocurrency payments
 */

import { PAYMENT_CONFIG, CURRENCY } from './config'
import type { PaymentIntent, PaymentResult } from './types'

const COINBASE_API_BASE = 'https://api.commerce.coinbase.com'

/**
 * Create Coinbase Commerce charge
 */
export async function createCryptoCharge(
    paymentIntent: PaymentIntent
): Promise<{ chargeId: string; hostedUrl: string; code: string }> {
    const apiKey = PAYMENT_CONFIG.crypto.apiKey

    if (!apiKey) {
        throw new Error('Coinbase Commerce is not configured')
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
            items: JSON.stringify(
                paymentIntent.items.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                }))
            ),
        },
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
        throw new Error(`Coinbase Commerce charge creation failed: ${error}`)
    }

    const data = await response.json()

    return {
        chargeId: data.data.id,
        hostedUrl: data.data.hosted_url,
        code: data.data.code,
    }
}

/**
 * Retrieve Coinbase Commerce charge
 */
export async function retrieveCryptoCharge(
    chargeId: string
): Promise<PaymentResult> {
    const apiKey = PAYMENT_CONFIG.crypto.apiKey

    if (!apiKey) {
        throw new Error('Coinbase Commerce is not configured')
    }

    const response = await fetch(`${COINBASE_API_BASE}/charges/${chargeId}`, {
        method: 'GET',
        headers: {
            'X-CC-Api-Key': apiKey,
            'X-CC-Version': '2018-03-22',
        },
    })

    if (!response.ok) {
        const error = await response.text()
        return {
            success: false,
            error: `Failed to retrieve charge: ${error}`,
        }
    }

    const data = await response.json()
    const charge = data.data

    // Check timeline for completed payment
    const completedEvent = charge.timeline?.find(
        (event: any) => event.status === 'COMPLETED'
    )

    if (completedEvent) {
        return {
            success: true,
            transactionId: charge.code,
            metadata: {
                chargeId: charge.id,
                cryptocurrency: charge.payments?.[0]?.network,
                confirmedAt: completedEvent.time,
                pricing: charge.pricing,
            },
        }
    }

    return {
        success: false,
        error: `Crypto payment not completed. Status: ${charge.timeline?.[charge.timeline.length - 1]?.status || 'UNKNOWN'}`,
    }
}

/**
 * Verify Coinbase Commerce webhook
 */
export async function verifyCryptoWebhook(
    signature: string,
    payload: string
): Promise<boolean> {
    const crypto = require('crypto')
    const secret = PAYMENT_CONFIG.crypto.webhookSecret

    if (!secret) {
        throw new Error('Coinbase Commerce webhook secret not configured')
    }

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')

    return signature === expectedSignature
}

/**
 * Get supported cryptocurrencies
 */
export function getSupportedCryptos(): string[] {
    return [
        'BTC',  // Bitcoin
        'ETH',  // Ethereum
        'USDC', // USD Coin
        'DAI',  // Dai
        'LTC',  // Litecoin
        'BCH',  // Bitcoin Cash
        'DOGE', // Dogecoin
    ]
}
