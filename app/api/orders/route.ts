import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { sendOrderConfirmation } from '@/lib/email/mailer'

// GET - Listar órdenes del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const where: any = {}

    // Si no es admin, solo ver sus propias órdenes
    if (session.user.role !== 'ADMIN') {
      where.userId = session.user.id
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    )
  }
}

// POST - Crear orden
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, shipping, paymentMethod = 'bitcoin', transactionId } = body

    // Calcular total
    let total = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })
      if (product) {
        total += product.price * item.quantity
      }
    }

    // Add tax
    const tax = total * 0.09
    total = total + tax

    // Crear orden con items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        paymentMethod,
        transactionId,
        paymentStatus: transactionId ? 'completed' : 'pending',
        status: transactionId ? 'PAID' : 'PENDING',
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingZip: shipping.zip,
        shippingPhone: shipping.phone || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Actualizar stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // 📧 ENVIAR EMAIL DE CONFIRMACIÓN (Solo si ya está pagada)
    if (order.status === 'PAID') {
      try {
        await sendOrderConfirmation({
          orderId: order.id,
          userName: shipping.name,
          userEmail: shipping.email,
          total: order.total,
          items: order.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color
          })),
          shippingAddress: `${shipping.address}, ${shipping.city}, ${shipping.zip}`,
          paymentMethod: paymentMethod || 'Bitcoin',
          orderDate: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        })
        console.log('✅ Email de confirmación enviado a:', shipping.email)
      } catch (emailError) {
        console.error('❌ Error enviando email:', emailError)
      }
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}
