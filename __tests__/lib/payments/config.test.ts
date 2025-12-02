/**
 * Payment Configuration Tests
 */

import {
    PAYMENT_METHODS,
    PAYMENT_CONFIG,
    getEnabledPaymentMethods,
    PAYMENT_LABELS,
    PAYMENT_ICONS
} from '@/lib/payments/config'

describe('Payment Configuration', () => {
    describe('PAYMENT_METHODS', () => {
        it('should have all payment method constants', () => {
            expect(PAYMENT_METHODS.PAYPAL).toBe('paypal')
            expect(PAYMENT_METHODS.STRIPE).toBe('stripe')
            expect(PAYMENT_METHODS.CRYPTO).toBe('crypto')
        })
    })

    describe('PAYMENT_CONFIG', () => {
        it('should have configuration for all payment methods', () => {
            expect(PAYMENT_CONFIG.paypal).toBeDefined()
            expect(PAYMENT_CONFIG.stripe).toBeDefined()
            expect(PAYMENT_CONFIG.crypto).toBeDefined()
        })

        it('should read from environment variables', () => {
            expect(PAYMENT_CONFIG.paypal.clientId).toBe(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)
            expect(PAYMENT_CONFIG.stripe.publishableKey).toBe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
            expect(PAYMENT_CONFIG.crypto.apiKey).toBe(process.env.NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY)
        })

        it('should have default mode for PayPal', () => {
            expect(['sandbox', 'live']).toContain(PAYMENT_CONFIG.paypal.mode)
        })
    })

    describe('getEnabledPaymentMethods', () => {
        it('should return array of enabled payment methods', () => {
            const methods = getEnabledPaymentMethods()
            expect(Array.isArray(methods)).toBe(true)
        })

        it('should only include methods with API keys', () => {
            const methods = getEnabledPaymentMethods()

            methods.forEach(method => {
                if (method === PAYMENT_METHODS.PAYPAL) {
                    expect(PAYMENT_CONFIG.paypal.enabled).toBe(true)
                } else if (method === PAYMENT_METHODS.STRIPE) {
                    expect(PAYMENT_CONFIG.stripe.enabled).toBe(true)
                } else if (method === PAYMENT_METHODS.CRYPTO) {
                    expect(PAYMENT_CONFIG.crypto.enabled).toBe(true)
                }
            })
        })
    })

    describe('PAYMENT_LABELS', () => {
        it('should have labels for all payment methods', () => {
            expect(PAYMENT_LABELS[PAYMENT_METHODS.PAYPAL]).toBeDefined()
            expect(PAYMENT_LABELS[PAYMENT_METHODS.STRIPE]).toBeDefined()
            expect(PAYMENT_LABELS[PAYMENT_METHODS.CRYPTO]).toBeDefined()
        })

        it('should have user-friendly Spanish labels', () => {
            expect(PAYMENT_LABELS[PAYMENT_METHODS.PAYPAL]).toContain('PayPal')
            expect(PAYMENT_LABELS[PAYMENT_METHODS.STRIPE]).toContain('Tarjeta')
            expect(PAYMENT_LABELS[PAYMENT_METHODS.CRYPTO]).toContain('Bitcoin')
        })
    })

    describe('PAYMENT_ICONS', () => {
        it('should have icons for all payment methods', () => {
            expect(PAYMENT_ICONS[PAYMENT_METHODS.PAYPAL]).toBeDefined()
            expect(PAYMENT_ICONS[PAYMENT_METHODS.STRIPE]).toBeDefined()
            expect(PAYMENT_ICONS[PAYMENT_METHODS.CRYPTO]).toBeDefined()
        })
    })
})
