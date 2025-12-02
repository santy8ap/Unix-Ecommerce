/**
 * API Route: Capture Payment
 * POST /api/payments/capture
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { verifyPayment, createOrderFromPayment, calculateOrderTotals } from '@/lib/payments/service'
import type { PaymentIntent } from '@/lib/payments/types'
import type { PaymentMethod } from '@/lib/payments/config'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { method, transactionId, items, shipping } = body as {
            method: PaymentMethod
            transactionId: string
            items: PaymentIntent['items']
            shipping: PaymentIntent['shipping']
        }

        // Validate input
        if (!method || !transactionId) {
            return NextResponse.json(
                { error: 'Missing payment method or transaction ID' },
                { status: 400 }
            )
        }

        // Verify payment with provider
        const paymentResult = await verifyPayment(method, transactionId)

        if (!paymentResult.success) {
            return NextResponse.json(
                { error: paymentResult.error || 'Payment verification failed' },
                { status: 400 }
            )
        }

        // Calculate totals
        const { subtotal, tax, total } = calculateOrderTotals(items)

        // Create payment intent for order creation
        const paymentIntent: PaymentIntent = {
            items,
            shipping,
            subtotal,
            tax,
            total,
            currency: 'USD',
        }

        // Create order in database
        const orderResult = await createOrderFromPayment(
            session.user.id,
            paymentIntent,
            paymentResult,
            method
        )

        return NextResponse.json({
            success: true,
            orderId: orderResult.orderId,
            transactionId: paymentResult.transactionId,
        })
    } catch (error: any) {
        console.error('Payment capture error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to capture payment' },
            { status: 500 }
        )
    }
}
