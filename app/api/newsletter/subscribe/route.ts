import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewsletterConfirmation } from '@/lib/services/email/mailer'

export async function POST(request: NextRequest) {
    try {
        const { email, name, source } = await request.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
        }

        // Check if already subscribed
        const existing = await prisma.newsletter.findUnique({
            where: { email },
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Este email ya está suscrito' },
                { status: 400 }
            )
        }

        // Create subscription (confirmed by default for easy UX)
        await prisma.newsletter.create({
            data: {
                email,
                name: name || null,
                source: source || 'WEBSITE',
                confirmed: true, // Auto-confirm
                confirmedAt: new Date(),
            },
        })

        // Fire and forget email (don't block response)
        sendNewsletterConfirmation(email).catch(err =>
            console.error('Failed to send newsletter email:', err)
        )

        return NextResponse.json({
            success: true,
            message: '¡Suscripción exitosa! Te hemos enviado un regalo a tu correo.',
        })
    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return NextResponse.json(
            { error: 'Error al procesar suscripción' },
            { status: 500 }
        )
    }
}
