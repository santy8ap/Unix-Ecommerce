import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Obtener ID del usuario
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // Borrar usuario (Prisma Cascade se encargará de borrar orders, reviews, etc si está configurado)
        // Si no, borramos manualmente lo crítico

        await prisma.$transaction(async (tx) => {
            // Borrar datos relacionados explícitamente si es necesario
            await tx.closetItem.deleteMany({ where: { userId: user.id } })
            await tx.outfit.deleteMany({ where: { userId: user.id } })

            // Finalmente borrar usuario
            await tx.user.delete({
                where: { id: user.id }
            })
        })

        return NextResponse.json({
            success: true,
            message: 'Cuenta eliminada permanentemente'
        })

    } catch (error) {
        console.error('Error deleting user account:', error)
        return NextResponse.json(
            { error: 'Error interno al eliminar la cuenta' },
            { status: 500 }
        )
    }
}
