/**
 * API: Generador de Outfits Mejorados con IA (UNIX)
 * POST /api/ai/outfits/enhanced - Generar outfits mezclando closet + productos de tienda
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { generateEnhancedOutfits } from '@/lib/services/ai/gemini'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                closetItems: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const body = await req.json()
        const {
            occasion = 'casual',
            budget,
            numberOfOutfits = 3,
            category,
            saveOutfits = false,
        } = body

        const validOccasions = ['casual', 'formal', 'party', 'business', 'date', 'sport', 'everyday']
        if (!validOccasions.includes(occasion)) {
            return NextResponse.json(
                {
                    error: `Ocasión inválida. Debe ser una de: ${validOccasions.join(', ')}`,
                },
                { status: 400 }
            )
        }

        // Preparar items del closet
        const closetItems = (user.closetItems || []).map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            color: item.color,
        }))

        // Obtener productos de la tienda
        const productsWhere: any = {
            active: true,
            stock: { gt: 0 },
        }

        if (category) {
            productsWhere.category = category
        }

        const storeProducts = await prisma.product.findMany({
            where: productsWhere,
            take: 50, // Limitar a 50 productos para no saturar el prompt
            select: {
                id: true,
                name: true,
                category: true,
                colors: true,
                price: true,
                images: true,
            },
        })

        if (storeProducts.length === 0) {
            return NextResponse.json(
                {
                    error: 'No hay productos disponibles en la tienda en este momento',
                },
                { status: 400 }
            )
        }

        // Parsear colores de productos
        // Note: Prisma returns String[] natively, no parse needed
        const products = storeProducts.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            colors: p.colors, // Native array
            price: p.price,
        }))

        // Generar outfits mejorados con IA
        let outfits
        try {
            outfits = await generateEnhancedOutfits({
                closetItems,
                storeProducts: products,
                userPreferences: {
                    skinTone: user.skinTone || undefined,
                    styleType: user.styleType || undefined,
                },
                occasion,
                budget: budget ? parseFloat(budget) : undefined,
                numberOfOutfits,
            })
        } catch (aiError) {
            console.error('Error generando outfits mejorados con IA:', aiError)
            return NextResponse.json(
                {
                    error: 'Error generando outfits mejorados. Intenta de nuevo más tarde.',
                    details: aiError instanceof Error ? aiError.message : 'Error desconocido',
                },
                { status: 500 }
            )
        }

        // Guardar outfits si se solicita
        if (saveOutfits && outfits && outfits.length > 0) {
            for (const outfit of outfits) {
                await prisma.outfit.create({
                    data: {
                        userId: user.id,
                        name: outfit.name,
                        description: outfit.description,
                        items: outfit.items as any, // Native JSON
                        occasion,
                        aiGenerated: true,
                    },
                })
            }
        }

        // Agregar información adicional de productos de tienda
        const enhancedOutfits = outfits.map((outfit) => {
            const itemsWithProductInfo = outfit.items.map((item) => {
                if (item.source === 'store' && item.productId) {
                    const product = storeProducts.find((p) => p.id === item.productId)
                    return {
                        ...item,
                        productDetails: product
                            ? {
                                price: product.price,
                                images: product.images,
                            }
                            : null,
                    }
                }
                return { ...item, productDetails: null }
            })

            // Calcular precio total de items de tienda
            const totalStorePrice = itemsWithProductInfo
                .filter((i) => i.source === 'store' && i.productDetails)
                .reduce((sum, i) => sum + (i.productDetails?.price || 0), 0)

            return {
                ...outfit,
                items: itemsWithProductInfo,
                pricing: {
                    totalStorePrice,
                    storeItemsCount: itemsWithProductInfo.filter((i) => i.source === 'store').length,
                    closetItemsCount: itemsWithProductInfo.filter((i) => i.source === 'closet').length,
                },
            }
        })

        return NextResponse.json({
            success: true,
            message: `${outfits.length} outfits mejorados generados exitosamente`,
            outfits: enhancedOutfits,
            saved: saveOutfits,
        })
    } catch (error) {
        console.error('Error en generador de outfits mejorados:', error)
        return NextResponse.json({ error: 'Error generando outfits mejorados' }, { status: 500 })
    }
}
