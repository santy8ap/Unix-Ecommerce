/**
 * API Route: Create Payment
 * POST /api/payments/create
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { processPayment, calculateOrderTotals } from '@/lib/payments/service'
import type { PaymentIntent } from '@/lib/payments/types'
import type { PaymentMethod } from '@/lib/payments/config'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { method, items, shipping } = body as {
            method: PaymentMethod
            items: PaymentIntent['items']
            shipping: PaymentIntent['shipping']
        }

        // Validate input
        if (!method || !items || !shipping) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (!items.length) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            )
        }

        // Calculate totals
        const { subtotal, tax, total } = calculateOrderTotals(items)

        // Create payment intent
        const paymentIntent: PaymentIntent = {
            items,
            shipping,
            subtotal,
            tax,
            total,
            currency: 'USD',
        }

        // Process payment
        const result = await processPayment(method, paymentIntent)

        return NextResponse.json({
            success: true,
            data: result,
            method,
        })
    } catch (error: any) {
        console.error('Payment creation error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create payment' },
            { status: 500 }
        )
    }
}
