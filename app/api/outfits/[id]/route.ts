/**
 * API: Gestión Individual de Outfit
 * GET /api/outfits/[id] - Obtener outfit específico
 * PATCH /api/outfits/[id] - Actualizar outfit
 * DELETE /api/outfits/[id] - Eliminar outfit
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

/**
 * GET - Obtener outfit específico
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const { id } = await params

        const outfit = await prisma.outfit.findFirst({
            where: {
                id,
                userId: user.id, // Solo puede ver sus propios outfits
            },
        })

        if (!outfit) {
            return NextResponse.json({ error: 'Outfit no encontrado' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            outfit: {
                ...outfit,
                items: outfit.items,
            },
        })
    } catch (error) {
        console.error('Error obteniendo outfit:', error)
        return NextResponse.json({ error: 'Error obteniendo outfit' }, { status: 500 })
    }
}

/**
 * PATCH - Actualizar outfit
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const { id } = await params

        // Verificar que el outfit existe y pertenece al usuario
        const existingOutfit = await prisma.outfit.findFirst({
            where: {
                id,
                userId: user.id,
            },
        })

        if (!existingOutfit) {
            return NextResponse.json({ error: 'Outfit no encontrado' }, { status: 404 })
        }

        const body = await req.json()
        const { name, description, items, occasion, season, favorite, timesWorn } = body

        // Construir objeto de actualización solo con campos proporcionados
        const updateData: any = {}

        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (items !== undefined) {
            if (!Array.isArray(items)) {
                return NextResponse.json({ error: 'items debe ser un array' }, { status: 400 })
            }
            updateData.items = items // Native JSON
        }
        if (occasion !== undefined) updateData.occasion = occasion
        if (season !== undefined) updateData.season = season
        if (favorite !== undefined) updateData.favorite = favorite
        if (timesWorn !== undefined) updateData.timesWorn = timesWorn

        const updatedOutfit = await prisma.outfit.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json({
            success: true,
            message: 'Outfit actualizado exitosamente',
            outfit: {
                ...updatedOutfit,
                items: updatedOutfit.items,
            },
        })
    } catch (error) {
        console.error('Error actualizando outfit:', error)
        return NextResponse.json({ error: 'Error actualizando outfit' }, { status: 500 })
    }
}

/**
 * DELETE - Eliminar outfit
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const { id } = await params

        // Verificar que el outfit existe y pertenece al usuario
        const existingOutfit = await prisma.outfit.findFirst({
            where: {
                id,
                userId: user.id,
            },
        })

        if (!existingOutfit) {
            return NextResponse.json({ error: 'Outfit no encontrado' }, { status: 404 })
        }

        await prisma.outfit.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Outfit eliminado exitosamente',
        })
    } catch (error) {
        console.error('Error eliminando outfit:', error)
        return NextResponse.json({ error: 'Error eliminando outfit' }, { status: 500 })
    }
}
