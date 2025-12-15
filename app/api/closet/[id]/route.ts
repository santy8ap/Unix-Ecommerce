
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const { id } = params

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
        }

        // Verificar que el item pertenece al usuario
        const existingItem = await prisma.closetItem.findFirst({
            where: {
                id,
                userId: user.id,
            },
        })

        if (!existingItem) {
            return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
        }

        // Eliminar item
        await prisma.closetItem.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Item eliminado exitosamente',
        })
    } catch (error) {
        console.error('Error eliminando item del closet:', error)
        return NextResponse.json({ error: 'Error eliminando item del closet' }, { status: 500 })
    }
}
