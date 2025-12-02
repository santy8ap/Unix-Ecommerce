/**
 * Products Page with Pagination and Filters
 * Example implementation showing how to use the new components
 */

'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductFilters, { FilterState } from '@/components/ProductFilters'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 12,
    })
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: 'Todas',
        color: 'Todos',
        size: 'Todas',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    })
    const [availableFilters, setAvailableFilters] = useState({
        categories: [],
        colors: [],
        sizes: [],
    })

    const fetchProducts = async (page: number) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.set('page', page.toString())
            params.set('limit', '12')

            // Add filters
            if (filters.search) params.set('search', filters.search)
            if (filters.category !== 'Todas') params.set('category', filters.category)
            if (filters.color !== 'Todos') params.set('color', filters.color)
            if (filters.size !== 'Todas') params.set('size', filters.size)
            if (filters.minPrice) params.set('minPrice', filters.minPrice)
            if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
            params.set('sortBy', filters.sortBy)
            params.set('sortOrder', filters.sortOrder)

            const response = await fetch(`/api/products?${params.toString()}`)
            const data = await response.json()

            setProducts(data.products)
            setPagination(data.pagination)
            if (data.filters) {
                setAvailableFilters(data.filters)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch products when filters change (reset to page 1)
    useEffect(() => {
        fetchProducts(1)
    }, [filters])

    const handlePageChange = (page: number) => {
        fetchProducts(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Nuestros Productos
                    </h1>
                    <p className="text-gray-600">
                        Explora nuestra colección de {pagination.total} productos
                    </p>
                </div>

                {/* Filters */}
                <ProductFilters
                    onFilterChange={setFilters}
                    availableCategories={availableFilters.categories}
                    availableColors={availableFilters.colors}
                    availableSizes={availableFilters.sizes}
                />

                {/* Loading State */}
                {loading ? (
                    <div className="py-12">
                        <Loading />
                    </div>
                ) : products.length === 0 ? (
                    /* Empty State */
                    <EmptyState
                        title="No se encontraron productos"
                        description="Intenta ajustar tus filtros de búsqueda"
                        actionLabel="Limpiar filtros"
                        onAction={() => setFilters({
                            search: '',
                            category: 'Todas',
                            color: 'Todos',
                            size: 'Todas',
                            minPrice: '',
                            maxPrice: '',
                            sortBy: 'createdAt',
                            sortOrder: 'desc',
                        })}
                    />
                ) : (
                    <>
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            className="mt-8"
                        />

                        {/* Results Info */}
                        <div className="text-center mt-6 text-gray-600 text-sm">
                            Mostrando {products.length} de {pagination.total} productos
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
