/**
 * Payment Gateway Configuration
 * Centralized configuration for all payment providers
 */

export const PAYMENT_METHODS = {
    PAYPAL: 'paypal',
    STRIPE: 'stripe',
    CRYPTO: 'crypto',
} as const

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS]

export const PAYMENT_CONFIG = {
    // PayPal
    paypal: {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE || 'sandbox', // 'sandbox' or 'live'
        enabled: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    },

    // Stripe
    stripe: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        enabled: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },

    // Coinbase Commerce (Bitcoin/Crypto)
    crypto: {
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

    if (PAYMENT_CONFIG.paypal.enabled) methods.push(PAYMENT_METHODS.PAYPAL)
    if (PAYMENT_CONFIG.stripe.enabled) methods.push(PAYMENT_METHODS.STRIPE)
    if (PAYMENT_CONFIG.crypto.enabled) methods.push(PAYMENT_METHODS.CRYPTO)

    return methods
}

/**
 * Payment method display names
 */
export const PAYMENT_LABELS = {
    [PAYMENT_METHODS.PAYPAL]: 'PayPal',
    [PAYMENT_METHODS.STRIPE]: 'Tarjeta de Crédito/Débito',
    [PAYMENT_METHODS.CRYPTO]: 'Bitcoin / Criptomonedas',
}

/**
 * Payment method icons (using emoji for simplicity)
 */
export const PAYMENT_ICONS = {
    [PAYMENT_METHODS.PAYPAL]: '💳',
    [PAYMENT_METHODS.STRIPE]: '💳',
    [PAYMENT_METHODS.CRYPTO]: '₿',
}
