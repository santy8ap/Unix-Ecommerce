/**
 * API: Capture Payment
 * POST /api/payments/capture - Check Bitcoin payment status
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { captureBitcoinPayment } from '@/lib/services/payments/bitcoin'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await req.json()
        const { method, chargeCode } = body

        if (method !== 'bitcoin') {
            return NextResponse.json(
                { error: 'Solo se acepta Bitcoin como método de pago' },
                { status: 400 }
            )
        }

        if (!chargeCode) {
            return NextResponse.json(
                { error: 'Charge code is required' },
                { status: 400 }
            )
        }

        // Check payment status
        const result = await captureBitcoinPayment(chargeCode)

        if (result.success) {
            return NextResponse.json({
                success: true,
                transactionId: result.transactionId,
                metadata: result.metadata,
                message: 'Pago verificado exitosamente',
            })
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 200 } // Still 200 so polling doesn't fail
            )
        }
    } catch (error: any) {
        console.error('Error capturing Bitcoin payment:', error)
        return NextResponse.json(
            { error: error.message || 'Error checking payment status' },
            { status: 500 }
        )
    }
}
