import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendCustomEmail } from '@/lib/email/mailer'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { id } = await params

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { status, paymentStatus } = await request.json()

        // Validar status
        const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
        }

        const order = await prisma.order.update({
            where: { id },
            data: {
                status: status || undefined,
                paymentStatus: paymentStatus || undefined,
            },
            include: { user: true }
        })

        // Enviar notificación por email si cambia a enviado
        if (status === 'SHIPPED') {
            await sendCustomEmail(
                order.shippingEmail,
                `Tu pedido #${order.id.slice(-8)} ha sido enviado 🚚`,
                `
            <h1>¡Tu pedido está en camino!</h1>
            <p>Hola ${order.shippingName},</p>
            <p>Tu pedido ha salido de nuestras instalaciones y está en camino a tu dirección.</p>
            <p>Gracias por comprar en Red Estampación.</p>
            `
            ).catch(console.error)
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { id } = await params

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        await prisma.order.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Orden eliminada' })
    } catch (error) {
        console.error('Error deleting order:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
