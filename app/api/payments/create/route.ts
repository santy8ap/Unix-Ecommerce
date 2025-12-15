/**
 * API: Create Payment
 * POST /api/payments/create - Create Bitcoin payment charge
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBitcoinCharge } from '@/lib/payments/bitcoin'
import type { PaymentIntent } from '@/lib/payments/types'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await req.json()
        const { method, amount, items, shipping, orderId } = body

        if (method !== 'bitcoin') {
            return NextResponse.json(
                { error: 'Solo se acepta Bitcoin como método de pago' },
                { status: 400 }
            )
        }

        if (!amount || !items || !shipping) {
            return NextResponse.json(
                { error: 'Datos de pago incompletos' },
                { status: 400 }
            )
        }

        // Calculate totals
        const subtotal = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        )
        const tax = subtotal * 0.09 // 9% tax
        const total = subtotal + tax

        const paymentIntent: PaymentIntent = {
            total,
            subtotal,
            tax,
            items,
            shipping,
            orderId,
        }

        // Create Bitcoin charge via Coinbase Commerce
        const { chargeId, checkoutUrl } = await createBitcoinCharge(paymentIntent)

        return NextResponse.json({
            success: true,
            chargeId,
            checkoutUrl,
            message: 'Charge de Bitcoin creado exitosamente',
        })
    } catch (error: any) {
        console.error('Error creating Bitcoin charge:', error)
        return NextResponse.json(
            { error: error.message || 'Error creating payment' },
            { status: 500 }
        )
    }
}
