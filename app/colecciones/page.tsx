'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Loading from '@/components/shared/Loading'
import { Sparkles, Package, Tag, TrendingUp, ChevronRight } from 'lucide-react'

interface Collection {
    id: number
    name: string
    description: string
    image: string
    products: number
}

interface Stats {
    total: number
    featured: number
    categories: number
}

export default function ColeccionesPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<Stats>({
        total: 0,
        featured: 0,
        categories: 0
    })

    useEffect(() => {
        // Cargar estadísticas
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                // La API retorna { products: [], pagination: {} }
                const products = data.products || []
                const total = products.length
                const featured = products.filter((p: any) => p.featured).length
                const categories = [...new Set(products.map((p: any) => p.category))].length
                setStats({ total, featured, categories })
            })
            .catch(error => {
                console.error('Error:', error)
            })

        // Definir colecciones
        const mockCollections: Collection[] = [
            {
                id: 1,
                name: 'Colección Verano 2024',
                description: 'Frescura y estilo para los días más calurosos del año. Ropa cómoda y colorida.',
                image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?q=80&w=1200&auto=format&fit=crop',
                products: 15
            },
            {
                id: 2,
                name: 'Urban Style',
                description: 'Moda urbana contemporánea para el día a día. Diseños modernos y versátiles.',
                image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1200&auto=format&fit=crop',
                products: 22
            },
            {
                id: 3,
                name: 'Deportiva Pro',
                description: 'Ropa técnica para alto rendimiento. Perfecta para tus entrenamientos.',
                image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
                products: 18
            },
            {
                id: 4,
                name: 'Vintage Collection',
                description: 'Los clásicos nunca pasan de moda. Diseños retro con toque contemporáneo.',
                image: 'https://images.unsplash.com/photo-1568447350776-3695690a443c?q=80&w=1200&auto=format&fit=crop',
                products: 12
            }
        ]

        setTimeout(() => {
            setCollections(mockCollections)
            setLoading(false)
        }, 300)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <Loading />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8" />
                        <span className="text-red-100 font-semibold">Nuestras Colecciones</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        Explora Nuestras Colecciones Exclusivas
                    </h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto">
                        Cada colección ha sido cuidadosamente seleccionada para ofrecerte lo mejor en moda estampada
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-6">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Package className="w-8 h-8 text-red-600" />
                                <p className="text-5xl font-bold text-red-600">{stats.total}</p>
                            </div>
                            <p className="text-gray-600 font-semibold">Productos Totales</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <TrendingUp className="w-8 h-8 text-red-600" />
                                <p className="text-5xl font-bold text-red-600">{stats.featured}</p>
                            </div>
                            <p className="text-gray-600 font-semibold">Productos Destacados</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Tag className="w-8 h-8 text-red-600" />
                                <p className="text-5xl font-bold text-red-600">{stats.categories}</p>
                            </div>
                            <p className="text-gray-600 font-semibold">Categorías</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Collections Grid */}
            <section className="flex-1 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/productos?category=${encodeURIComponent(collection.name)}`}
                                className="group"
                            >
                                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:-translate-y-2 border border-gray-200">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-gray-200">
                                        <img
                                            src={collection.image}
                                            alt={collection.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition">
                                                {collection.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {collection.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                {collection.products} productos
                                            </span>
                                            <div className="group-hover:translate-x-1 transition-transform">
                                                <ChevronRight className="w-5 h-5 text-red-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">¿No encontraste lo que buscas?</h2>
                    <p className="text-red-100 mb-6 text-lg">
                        Explora todos nuestros productos o contacta a nuestro equipo de atención al cliente
                    </p>
                    <Link
                        href="/productos"
                        className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                    >
                        Ver Todos los Productos
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
