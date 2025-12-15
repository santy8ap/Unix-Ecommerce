import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear usuario admin
  const adminEmail = 'admin@redestampacion.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  let adminUser
  if (!existingAdmin) {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        role: 'ADMIN',
        emailVerified: new Date(),
      }
    })
    console.log('✅ Usuario admin creado')
  } else {
    adminUser = existingAdmin
    console.log('ℹ️ Usuario admin ya existe')
  }

  // Crear productos de prueba
  const products = [
    {
      name: 'Camiseta Básica Negra',
      description: 'Camiseta de algodón 100% premium, perfecta para el día a día',
      price: 29.99,
      images: ['https://picsum.photos/500/500?random=1'],
      category: 'Casual',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro', 'Blanco', 'Gris'],
      stock: 100,
      featured: true,
      active: true
    },
    {
      name: 'Sudadera con Capucha',
      description: 'Sudadera cómoda y abrigada, ideal para el invierno',
      price: 49.99,
      images: ['https://picsum.photos/500/500?random=2'],
      category: 'Casual',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Azul', 'Negro', 'Gris'],
      stock: 75,
      featured: true,
      active: true
    },
    {
      name: 'Polo Deportivo',
      description: 'Polo técnico con tecnología dry-fit para mantener la frescura',
      price: 34.99,
      images: ['https://picsum.photos/500/500?random=3'],
      category: 'Deportiva',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Azul', 'Rojo', 'Verde'],
      stock: 60,
      featured: true,
      active: true
    },
    {
      name: 'Camisa Formal Blanca',
      description: 'Camisa elegante para ocasiones especiales',
      price: 59.99,
      images: ['https://picsum.photos/500/500?random=4'],
      category: 'Formal',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blanco', 'Azul', 'Negro'],
      stock: 40,
      featured: false,
      active: true
    },
    {
      name: 'Camiseta Vintage Rock',
      description: 'Diseño retro inspirado en las bandas clásicas',
      price: 39.99,
      images: ['https://picsum.photos/500/500?random=5'],
      category: 'Vintage',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro', 'Gris'],
      stock: 50,
      featured: true,
      active: true
    },
    {
      name: 'Camiseta Estampada Tropical',
      description: 'Diseño tropical perfecto para el verano',
      price: 32.99,
      images: ['https://picsum.photos/500/500?random=6'],
      category: 'Estampada',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blanco', 'Amarillo', 'Verde'],
      stock: 80,
      featured: true,
      active: true
    },
    {
      name: 'Joggers Deportivos',
      description: 'Pantalones cómodos para entrenar o relajarse',
      price: 44.99,
      images: ['https://picsum.photos/500/500?random=7'],
      category: 'Deportiva',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Negro', 'Gris', 'Azul'],
      stock: 65,
      featured: false,
      active: true
    },
    {
      name: 'Blazer Casual',
      description: 'Blazer moderno para un look semi-formal',
      price: 89.99,
      images: ['https://picsum.photos/500/500?random=8'],
      category: 'Formal',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro', 'Gris', 'Azul'],
      stock: 30,
      featured: true,
      active: true
    }
  ]

  console.log('🌱 Creando productos...')

  for (const product of products) {
    const exists = await prisma.product.findFirst({
      where: { name: product.name }
    })

    if (!exists) {
      await prisma.product.create({ data: product })
      console.log(`✅ Producto creado: ${product.name}`)
    } else {
      console.log(`ℹ️ Producto ya existe: ${product.name}`)
    }
  }

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
