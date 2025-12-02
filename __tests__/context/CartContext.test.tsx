/**
 * Cart Context Tests
 */

import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/context/CartContext'
import { toast } from 'sonner'

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
    },
}))

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString()
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

describe('CartContext', () => {
    beforeEach(() => {
        localStorageMock.clear()
        jest.clearAllMocks()
    })

    it('should initialize with empty cart', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        expect(result.current.items).toEqual([])
        expect(result.current.total).toBe(0)
        expect(result.current.itemCount).toBe(0)
    })

    it('should add item to cart', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        act(() => {
            result.current.addItem({
                productId: '1',
                name: 'Test Product',
                price: 100,
                quantity: 1,
                size: 'M',
                color: 'Red',
                image: 'test.jpg',
            })
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0].name).toBe('Test Product')
        expect(result.current.total).toBe(100)
        expect(toast.success).toHaveBeenCalled()
    })

    it('should update quantity when adding same item', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        const item = {
            productId: '1',
            name: 'Test Product',
            price: 100,
            quantity: 1,
            size: 'M',
            color: 'Red',
            image: 'test.jpg',
        }

        act(() => {
            result.current.addItem(item)
            result.current.addItem(item)
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0].quantity).toBe(2)
        expect(result.current.total).toBe(200)
    })

    it('should remove item from cart', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        act(() => {
            result.current.addItem({
                productId: '1',
                name: 'Test Product',
                price: 100,
                quantity: 1,
                size: 'M',
                color: 'Red',
                image: 'test.jpg',
            })
        })

        expect(result.current.items).toHaveLength(1)

        act(() => {
            result.current.removeItem('1', 'M', 'Red')
        })

        expect(result.current.items).toHaveLength(0)
        expect(result.current.total).toBe(0)
    })

    it('should update item quantity', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        act(() => {
            result.current.addItem({
                productId: '1',
                name: 'Test Product',
                price: 100,
                quantity: 1,
                size: 'M',
                color: 'Red',
                image: 'test.jpg',
            })
        })

        act(() => {
            result.current.updateQuantity('1', 'M', 'Red', 5)
        })

        expect(result.current.items[0].quantity).toBe(5)
        expect(result.current.total).toBe(500)
    })

    it('should clear cart', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        act(() => {
            result.current.addItem({
                productId: '1',
                name: 'Test Product',
                price: 100,
                quantity: 1,
                size: 'M',
                color: 'Red',
                image: 'test.jpg',
            })
        })

        act(() => {
            result.current.clearCart()
        })

        expect(result.current.items).toHaveLength(0)
        expect(result.current.total).toBe(0)
    })

    it('should calculate total correctly', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        act(() => {
            result.current.addItem({
                productId: '1',
                name: 'Product 1',
                price: 100,
                quantity: 2,
                size: 'M',
                color: 'Red',
                image: 'test1.jpg',
            })

            result.current.addItem({
                productId: '2',
                name: 'Product 2',
                price: 50,
                quantity: 3,
                size: 'L',
                color: 'Blue',
                image: 'test2.jpg',
            })
        })

        expect(result.current.total).toBe(350) // (100 * 2) + (50 * 3)
        expect(result.current.itemCount).toBe(5) // 2 + 3
    })

    it('should respect stock limit', () => {
        const { result } = renderHook(() => useCart(), {
            wrapper: CartProvider,
        })

        act(() => {
            result.current.addItem({
                productId: '1',
                name: 'Limited Product',
                price: 100,
                quantity: 5,
                size: 'M',
                color: 'Red',
                image: 'test.jpg',
                stock: 10,
            })
        })

        act(() => {
            result.current.addItem({
                productId: '1',
                name: 'Limited Product',
                price: 100,
                quantity: 10, // This would exceed stock
                size: 'M',
                color: 'Red',
                image: 'test.jpg',
                stock: 10,
            })
        })

        expect(result.current.items[0].quantity).toBe(10) // Capped at stock
        expect(toast.warning).toHaveBeenCalled()
    })
})
