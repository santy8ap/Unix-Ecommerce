/**
 * Payment Types
 * Shared types for payment processing
 */

export interface PaymentItem {
    productId: string
    name: string
    quantity: number
    price: number
    size: string
    color: string
}

export interface ShippingDetails {
    name: string
    email: string
    address: string
    city: string
    zip: string
    phone?: string
}

export interface PaymentIntent {
    items: PaymentItem[]
    shipping: ShippingDetails
    total: number
    subtotal: number
    tax: number
    currency: string
}

export interface PaymentResult {
    success: boolean
    orderId?: string
    transactionId?: string
    error?: string
    metadata?: Record<string, any>
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export interface PaymentRecord {
    id: string
    orderId: string
    method: string
    status: PaymentStatus
    amount: number
    currency: string
    transactionId?: string
    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
}
