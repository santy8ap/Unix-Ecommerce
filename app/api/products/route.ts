import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { productSchema, validateRequest } from '@/lib/validations/schemas'

// GET - Listar productos con filtros nativos y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Paginación
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const skip = (page - 1) * limit

    // Filtros
    const category = searchParams.get('category')
    const color = searchParams.get('color')
    const size = searchParams.get('size')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const recommendedOnly = searchParams.get('recommendedOnly') === 'true'

    const where: any = { active: true }

    if (category && category !== 'Todas') where.category = category
    if (featured === 'true') where.featured = true

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filtros Nativos de Array (PostgreSQL)
    if (color && color !== 'Todos') {
      where.colors = { has: color }
    }

    if (size && size !== 'Todas') {
      where.sizes = { has: size }
    }

    const orderBy: any = {}
    if (sortBy === 'price' || sortBy === 'name' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    // UNIX: Obtener preferencias del usuario
    let userPreferences = null
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { skinTone: true, styleType: true },
        })
        userPreferences = user
      }
    } catch (error) {
      // Silent error logic
    }

    const total = await prisma.product.count({ where })

    let products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy
    })

    // AI Decoration
    let parsedProducts: any[] = products.map(p => ({
      ...p,
      // No JSON parsing needed now! Native arrays FTW.
    }))

    if (userPreferences) {
      parsedProducts = parsedProducts.map(p => {
        const isRecommendedColor = checkColorRecommendation(p.colors, userPreferences!.skinTone)
        const isRecommendedStyle = checkStyleRecommendation(p.styleTypes, userPreferences!.styleType)

        return {
          ...p,
          isRecommendedColor,
          isRecommendedStyle,
          isRecommended: isRecommendedColor || isRecommendedStyle,
        }
      })

      if (recommendedOnly) {
        parsedProducts = parsedProducts.filter((p) => p.isRecommended)
      }
    } else if (recommendedOnly) {
      parsedProducts = []
    }

    // Metadata for filters
    const categories = await prisma.product.findMany({
      where: { active: true },
      select: { category: true },
      distinct: ['category']
    }).then(res => res.map(p => p.category))

    // Collect all unique colors/sizes natively
    const allProductsMetadata = await prisma.product.findMany({
      where: { active: true },
      select: { colors: true, sizes: true }
    })

    const allColors = new Set<string>()
    const allSizes = new Set<string>()

    allProductsMetadata.forEach(p => {
      // p.colors is already string[]
      p.colors.forEach((c: string) => allColors.add(c))
      p.sizes.forEach((s: string) => allSizes.add(s))
    })

    return NextResponse.json({
      products: parsedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      },
      filters: {
        categories,
        colors: Array.from(allColors),
        sizes: Array.from(allSizes)
      },
      userPreferences
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

// Helpers AI logic remains same logic but simpler types
function checkColorRecommendation(productColors: string[], skinTone: string | null): boolean {
  if (!skinTone || !productColors) return false
  const warmColors = ['beige', 'brown', 'orange', 'gold', 'yellow', 'cream', 'caramel', 'olive', 'red']
  const coolColors = ['blue', 'silver', 'gray', 'pink', 'purple', 'white', 'black', 'navy']
  const neutralColors = ['beige', 'gray', 'white', 'black', 'burgundy', 'teal']
  const colorsLower = productColors.map(c => c.toLowerCase())

  if (skinTone === 'warm') return colorsLower.some(c => warmColors.some(wc => c.includes(wc)))
  else if (skinTone === 'cool') return colorsLower.some(c => coolColors.some(cc => c.includes(cc)))
  else if (skinTone === 'neutral') return colorsLower.some(c => neutralColors.some(nc => c.includes(nc)))
  return false
}

function checkStyleRecommendation(productStyles: string[], userStyle: string | null): boolean {
  if (!userStyle || !productStyles || productStyles.length === 0) return false
  return productStyles.includes(userStyle)
}

// POST - Crear producto (Native Arrays)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validation = await validateRequest(productSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.errors }, { status: 400 })
    }

    const validData = validation.data

    // Now we save native arrays directly! No more JSON.stringify
    // But check if validateRequest returns already parsed arrays or strings.
    // productSchema probably validates array input.

    // Safety check: parse if string (backward compatibility with old frontend input)
    const images = typeof validData.images === 'string' ? JSON.parse(validData.images) : validData.images
    const sizes = typeof validData.sizes === 'string' ? JSON.parse(validData.sizes) : validData.sizes
    const colors = typeof validData.colors === 'string' ? JSON.parse(validData.colors) : validData.colors

    const product = await prisma.product.create({
      data: {
        name: validData.name,
        description: validData.description,
        price: parseFloat(validData.price.toString()),
        images: images,
        category: validData.category,
        sizes: sizes,
        colors: colors,
        stock: parseInt(validData.stock.toString()),
        featured: validData.featured || false,
        active: validData.active !== undefined ? validData.active : true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
