export interface Product {
    id: string
    name: string
    description: string
    price: number
    images: string
    category: string
    sizes: string
    colors: string
    stock: number
    featured: boolean
    active: boolean
    createdAt: Date | string
    updatedAt: Date | string
}

export type ProductWithParsedImages = Omit<Product, 'images' | 'sizes' | 'colors'> & {
    images: string[]
    sizes: string[]
    colors: string[]
}
