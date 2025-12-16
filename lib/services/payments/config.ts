/**
 * Payment Gateway Configuration
 * Bitcoin/Crypto only configuration
 */

export const PAYMENT_METHODS = {
    BITCOIN: 'bitcoin',
} as const

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS]

export const PAYMENT_CONFIG = {
    // Bitcoin/Crypto via Coinbase Commerce
    bitcoin: {
        apiKey: process.env.NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY,
        webhookSecret: process.env.COINBASE_COMMERCE_WEBHOOK_SECRET,
        enabled: !!process.env.NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY,
    },
}

export const CURRENCY = 'USD'

export const TAX_RATE = 0.09 // 9% tax rate

/**
 * Get list of enabled payment methods
 */
export function getEnabledPaymentMethods(): PaymentMethod[] {
    const methods: PaymentMethod[] = []

    if (PAYMENT_CONFIG.bitcoin.enabled) methods.push(PAYMENT_METHODS.BITCOIN)

    return methods
}

/**
 * Payment method display names
 */
export const PAYMENT_LABELS = {
    [PAYMENT_METHODS.BITCOIN]: 'Bitcoin / Criptomonedas',
}

/**
 * Payment method icons
 */
export const PAYMENT_ICONS = {
    [PAYMENT_METHODS.BITCOIN]: '₿',
}
