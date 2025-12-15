/**
 * API: Coinbase Commerce Webhook
 * POST /api/webhooks/coinbase - Handle Coinbase Commerce webhook events
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyCoinbaseWebhook } from '@/lib/payments/bitcoin'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email/mailer'

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const headers: Record<string, string> = {}

        req.headers.forEach((value, key) => {
            headers[key] = value
        })

        // Verify webhook signature
        const isValid = await verifyCoinbaseWebhook(headers, body)

        if (!isValid) {
            console.error('Invalid Coinbase webhook signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const event = JSON.parse(body)

        console.log('Coinbase webhook event:', event.type)

        // Handle different event types
        switch (event.type) {
            case 'charge:confirmed':
            case 'charge:resolved':
                // Payment confirmed - update order status
                const chargeCode = event.data.code
                const metadata = event.data.metadata

                if (metadata?.orderId) {
                    const order = await prisma.order.update({
                        where: { id: metadata.orderId },
                        data: {
                            status: 'PAID',
                            paymentStatus: 'completed',
                            transactionId: chargeCode, // Ensure we save the charge code
                        },
                        include: {
                            items: {
                                include: { product: true }
                            }
                        }
                    })

                    console.log(`Order ${metadata.orderId} marked as paid`)

                    // Send Confirmation Email
                    try {
                        await sendOrderConfirmation({
                            orderId: order.id,
                            customerName: order.shippingName,
                            customerEmail: order.shippingEmail,
                            total: order.total,
                            items: order.items,
                            shippingAddress: {
                                address: order.shippingAddress,
                                city: order.shippingCity,
                                zip: order.shippingZip,
                                name: order.shippingName,
                                email: order.shippingEmail
                            }
                        })
                    } catch (error) {
                        console.error('Failed to send confirmation email from webhook:', error)
                    }
                }
                break

            case 'charge:failed':
                // Payment failed
                const failedCode = event.data.code
                const failedMetadata = event.data.metadata

                if (failedMetadata?.orderId) {
                    const order = await prisma.order.update({
                        where: { id: failedMetadata.orderId },
                        data: {
                            status: 'CANCELLED',
                            paymentStatus: 'failed',
                        },
                        include: { items: true }
                    })

                    console.log(`Order ${failedMetadata.orderId} marked as failed`)

                    // Restore Stock because we reserved it on creation
                    for (const item of order.items) {
                        await prisma.product.update({
                            where: { id: item.productId },
                            data: { stock: { increment: item.quantity } }
                        })
                    }
                    console.log(`Stock restored for order ${failedMetadata.orderId}`)
                }
                break

            case 'charge:pending':
                // Payment pending - optional handling
                console.log('Payment pending:', event.data.code)
                break

            default:
                console.log('Unhandled event type:', event.type)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Error processing Coinbase webhook:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
