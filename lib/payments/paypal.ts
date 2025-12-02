/**
 * PayPal Payment Provider
 * Handles PayPal payment processing
 */

import { PAYMENT_CONFIG, CURRENCY } from './config'
import type { PaymentIntent, PaymentResult } from './types'

const PAYPAL_API_BASE =
    PAYMENT_CONFIG.paypal.mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com'

/**
 * Get PayPal access token
 */
async function getAccessToken(): Promise<string> {
    const auth = Buffer.from(
        `${PAYMENT_CONFIG.paypal.clientId}:${PAYMENT_CONFIG.paypal.clientSecret}`
    ).toString('base64')

    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`,
        },
        body: 'grant_type=client_credentials',
    })

    const data = await response.json()
    return data.access_token
}

/**
 * Create PayPal order
 */
export async function createPayPalOrder(
    paymentIntent: PaymentIntent
): Promise<{ orderId: string }> {
    const accessToken = await getAccessToken()

    const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: CURRENCY,
                    value: paymentIntent.total.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: CURRENCY,
                            value: paymentIntent.subtotal.toFixed(2),
                        },
                        tax_total: {
                            currency_code: CURRENCY,
                            value: paymentIntent.tax.toFixed(2),
                        },
                    },
                },
                items: paymentIntent.items.map((item) => ({
                    name: item.name,
                    quantity: item.quantity.toString(),
                    unit_amount: {
                        currency_code: CURRENCY,
                        value: item.price.toFixed(2),
                    },
                    description: `${item.size} - ${item.color}`,
                })),
                shipping: {
                    name: {
                        full_name: paymentIntent.shipping.name,
                    },
                    address: {
                        address_line_1: paymentIntent.shipping.address,
                        admin_area_2: paymentIntent.shipping.city,
                        postal_code: paymentIntent.shipping.zip,
                        country_code: 'US',
                    },
                },
            },
        ],
        application_context: {
            shipping_preference: 'SET_PROVIDED_ADDRESS',
            user_action: 'PAY_NOW',
        },
    }

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`PayPal order creation failed: ${error}`)
    }

    const data = await response.json()
    return { orderId: data.id }
}

/**
 * Capture PayPal order after approval
 */
export async function capturePayPalOrder(
    orderId: string
): Promise<PaymentResult> {
    const accessToken = await getAccessToken()

    const response = await fetch(
        `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    if (!response.ok) {
        const error = await response.text()
        return {
            success: false,
            error: `PayPal capture failed: ${error}`,
        }
    }

    const data = await response.json()

    if (data.status === 'COMPLETED') {
        return {
            success: true,
            transactionId: data.id,
            metadata: {
                payerId: data.payer?.payer_id,
                payerEmail: data.payer?.email_address,
                captureDetails: data.purchase_units[0]?.payments?.captures[0],
            },
        }
    }

    return {
        success: false,
        error: `PayPal payment not completed. Status: ${data.status}`,
    }
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyPayPalWebhook(
    headers: Record<string, string>,
    body: any
): Promise<boolean> {
    // PayPal webhook verification logic
    // Implement based on PayPal documentation
    return true // Placeholder
}
