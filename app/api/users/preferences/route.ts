/**
 * API: Guardar y obtener preferencias de usuario (UNIX)
 * POST /api/users/preferences - Guardar preferencias
 * GET /api/users/preferences - Obtener preferencias
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                skinTone: true,
                styleType: true,
                onboardingCompleted: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            preferences: {
                skinTone: user.skinTone,
                styleType: user.styleType,
                onboardingCompleted: user.onboardingCompleted,
            },
        })
    } catch (error) {
        console.error('Error obteniendo preferencias:', error)
        return NextResponse.json(
            { error: 'Error obteniendo preferencias de usuario' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await req.json()
        const { skinTone, styleType, onboardingCompleted } = body

        // Validaciones
        const validSkinTones = ['warm', 'cool', 'neutral']
        const validStyleTypes = ['casual', 'formal', 'sporty', 'elegant', 'bohemian']

        if (skinTone && !validSkinTones.includes(skinTone)) {
            return NextResponse.json(
                { error: 'skinTone inválido. Debe ser: warm, cool, o neutral' },
                { status: 400 }
            )
        }

        if (styleType && !validStyleTypes.includes(styleType)) {
            return NextResponse.json(
                { error: 'styleType inválido. Debe ser: casual, formal, sporty, elegant, o bohemian' },
                { status: 400 }
            )
        }

        // Actualizar preferencias
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                ...(skinTone && { skinTone }),
                ...(styleType && { styleType }),
                ...(typeof onboardingCompleted === 'boolean' && { onboardingCompleted }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                skinTone: true,
                styleType: true,
                onboardingCompleted: true,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Preferencias actualizadas correctamente',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                preferences: {
                    skinTone: updatedUser.skinTone,
                    styleType: updatedUser.styleType,
                    onboardingCompleted: updatedUser.onboardingCompleted,
                },
            },
        })
    } catch (error) {
        console.error('Error guardando preferencias:', error)
        return NextResponse.json(
            { error: 'Error guardando preferencias de usuario' },
            { status: 500 }
        )
    }
}
