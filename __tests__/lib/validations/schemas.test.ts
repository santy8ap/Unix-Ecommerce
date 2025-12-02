/**
 * Validation Schemas Tests
 */

import { productSchema, checkoutSchema, filterSchema, validateRequest } from '@/lib/validations/schemas'

describe('Validation Schemas', () => {
    describe('productSchema', () => {
        it('should validate valid product data', async () => {
            const validProduct = {
                name: 'Test Product',
                description: 'This is a test product description',
                price: 99.99,
                category: 'Casual',
                stock: 10,
                images: [],
                sizes: [],
                colors: [],
            }

            const result = await validateRequest(productSchema, validProduct)
            expect(result.success).toBe(true)
        })

        it('should fail with invalid name (too short)', async () => {
            const invalidProduct = {
                name: 'Ab', // Too short
                description: 'This is a test product description',
                price: 99.99,
                category: 'Casual',
                stock: 10,
            }

            const result = await validateRequest(productSchema, invalidProduct)
            expect(result.success).toBe(false)
            expect(result.errors).toContain('Mínimo 3 caracteres')
        })

        it('should fail with negative price', async () => {
            const invalidProduct = {
                name: 'Test Product',
                description: 'This is a test product description',
                price: -10,
                category: 'Casual',
                stock: 10,
            }

            const result = await validateRequest(productSchema, invalidProduct)
            expect(result.success).toBe(false)
            expect(result.errors?.[0]).toContain('positivo')
        })

        it('should fail with negative stock', async () => {
            const invalidProduct = {
                name: 'Test Product',
                description: 'This is a test product description',
                price: 99.99,
                category: 'Casual',
                stock: -5,
            }

            const result = await validateRequest(productSchema, invalidProduct)
            expect(result.success).toBe(false)
        })
    })

    describe('checkoutSchema', () => {
        it('should validate valid checkout data', async () => {
            const validCheckout = {
                shippingName: 'John Doe',
                shippingEmail: 'john@example.com',
                shippingAddress: '123 Main St',
                shippingCity: 'New York',
                shippingZip: '12345',
            }

            const result = await validateRequest(checkoutSchema, validCheckout)
            expect(result.success).toBe(true)
        })

        it('should fail with invalid email', async () => {
            const invalidCheckout = {
                shippingName: 'John Doe',
                shippingEmail: 'invalid-email',
                shippingAddress: '123 Main St',
                shippingCity: 'New York',
                shippingZip: '12345',
            }

            const result = await validateRequest(checkoutSchema, invalidCheckout)
            expect(result.success).toBe(false)
            expect(result.errors?.[0]).toContain('Email inválido')
        })

        it('should fail with invalid zip code', async () => {
            const invalidCheckout = {
                shippingName: 'John Doe',
                shippingEmail: 'john@example.com',
                shippingAddress: '123 Main St',
                shippingCity: 'New York',
                shippingZip: '123', // Not 5 digits
            }

            const result = await validateRequest(checkoutSchema, invalidCheckout)
            expect(result.success).toBe(false)
            expect(result.errors?.[0]).toContain('5 dígitos')
        })

        it('should fail with short name', async () => {
            const invalidCheckout = {
                shippingName: 'JD', // Too short
                shippingEmail: 'john@example.com',
                shippingAddress: '123 Main St',
                shippingCity: 'New York',
                shippingZip: '12345',
            }

            const result = await validateRequest(checkoutSchema, invalidCheckout)
            expect(result.success).toBe(false)
        })
    })

    describe('filterSchema', () => {
        it('should validate valid filter data', async () => {
            const validFilters = {
                category: 'Casual',
                color: 'Blue',
                size: 'M',
                minPrice: 10,
                maxPrice: 100,
                search: 'shirt',
                page: 1,
                limit: 12,
            }

            const result = await validateRequest(filterSchema, validFilters)
            expect(result.success).toBe(true)
        })

        it('should allow optional filters', async () => {
            const minimalFilters = {}

            const result = await validateRequest(filterSchema, minimalFilters)
            expect(result.success).toBe(true)
        })

        it('should fail with negative minPrice', async () => {
            const invalidFilters = {
                minPrice: -10,
            }

            const result = await validateRequest(filterSchema, invalidFilters)
            expect(result.success).toBe(false)
        })

        it('should fail with excessive maxPrice', async () => {
            const invalidFilters = {
                maxPrice: 100000, // Too high
            }

            const result = await validateRequest(filterSchema, invalidFilters)
            expect(result.success).toBe(false)
        })
    })
})
