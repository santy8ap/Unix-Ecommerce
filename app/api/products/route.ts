import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { productSchema, filterSchema, validateRequest } from '@/lib/validations/schemas'

// Helper para parsear JSON
function parseJSON(str: string): any {
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
}

// GET - Listar productos con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Paginación
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50) // Max 50 items per page
    const skip = (page - 1) * limit

    // Filtros
    const category = searchParams.get('category')
    const color = searchParams.get('color')
    const size = searchParams.get('size')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt' // createdAt, price, name
    const sortOrder = searchParams.get('sortOrder') || 'desc' // asc or desc

    const where: any = { active: true }

    // Category filter
    if (category && category !== 'Todas') where.category = category

    // Featured filter
    if (featured === 'true') where.featured = true

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Search filter (case insensitive)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Determine order by
    const orderBy: any = {}
    if (sortBy === 'price' || sortBy === 'name' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    // Total de productos
    const total = await prisma.product.count({ where })

    // Productos paginados
    let products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy
    })

    // Parsear los campos JSON y filtrar por color/talla
    let parsedProducts = products.map(p => ({
      ...p,
      images: parseJSON(p.images),
      sizes: parseJSON(p.sizes),
      colors: parseJSON(p.colors)
    }))

    // Filtrar por color si se especifica
    if (color && color !== 'Todos') {
      parsedProducts = parsedProducts.filter(p =>
        p.colors.includes(color)
      )
    }

    // Filtrar por talla si se especifica
    if (size && size !== 'Todas') {
      parsedProducts = parsedProducts.filter(p =>
        p.sizes.includes(size)
      )
    }

    // Get unique categories, colors, and sizes for filtering
    const allProducts = await prisma.product.findMany({
      where: { active: true },
      select: { category: true, colors: true, sizes: true }
    })

    const categories = [...new Set(allProducts.map(p => p.category))]
    const allColors = new Set<string>()
    const allSizes = new Set<string>()

    allProducts.forEach(p => {
      parseJSON(p.colors).forEach((c: string) => allColors.add(c))
      parseJSON(p.sizes).forEach((s: string) => allSizes.add(s))
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
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear producto con validación Yup
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validar con Yup
    const validation = await validateRequest(productSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.errors },
        { status: 400 }
      )
    }

    const validData = validation.data

    const product = await prisma.product.create({
      data: {
        name: validData.name,
        description: validData.description,
        price: parseFloat(validData.price.toString()),
        images: typeof validData.images === 'string' ? validData.images : JSON.stringify(validData.images),
        category: validData.category,
        sizes: typeof validData.sizes === 'string' ? validData.sizes : JSON.stringify(validData.sizes),
        colors: typeof validData.colors === 'string' ? validData.colors : JSON.stringify(validData.colors),
        stock: parseInt(validData.stock.toString()),
        featured: validData.featured || false,
        active: validData.active !== undefined ? validData.active : true
      }
    })

    return NextResponse.json({
      ...product,
      images: parseJSON(product.images),
      sizes: parseJSON(product.sizes),
      colors: parseJSON(product.colors)
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
