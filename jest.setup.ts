import '@testing-library/jest-dom'

// @ts-ignore
const mockJest = (global as any).jest

class IntersectionObserver {
    observe = mockJest.fn()
    disconnect = mockJest.fn()
    unobserve = mockJest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
})

Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
