/**
 * Payment Types
 * Bitcoin/Crypto payment types
 */

export interface PaymentIntent {
    total: number
    subtotal: number
    tax: number
    items: PaymentItem[]
    shipping: ShippingInfo
    orderId?: string
}

export interface PaymentItem {
    name: string
    quantity: number
    price: number
    size: string
    color: string
}

export interface ShippingInfo {
    name: string
    email: string
    address: string
    city: string
    zip: string
}

export interface PaymentResult {
    success: boolean
    transactionId?: string
    error?: string
    metadata?: any
}

export interface BitcoinCharge {
    id: string
    code: string
    hosted_url: string
    checkout_url?: string
    pricing: {
        local: { amount: string; currency: string }
        bitcoin: { amount: string; currency: string }
    }
    timeline: Array<{
        status: string
        time: string
    }>
    metadata?: any
}
