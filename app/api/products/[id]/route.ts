import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Obtener un producto
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Return product directly as it now contains native arrays
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const dataToUpdate: any = { ...body }

    // Ensure we save arrays, handling potential legacy JSON strings
    if (body.images) {
      dataToUpdate.images = typeof body.images === 'string' ? JSON.parse(body.images) : body.images
    }
    if (body.sizes) {
      dataToUpdate.sizes = typeof body.sizes === 'string' ? JSON.parse(body.sizes) : body.sizes
    }
    if (body.colors) {
      dataToUpdate.colors = typeof body.colors === 'string' ? JSON.parse(body.colors) : body.colors
    }

    if (body.price) dataToUpdate.price = parseFloat(body.price)
    if (body.stock !== undefined) dataToUpdate.stock = parseInt(body.stock)

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Producto eliminado' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}