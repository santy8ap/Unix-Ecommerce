/**
 * Rate Limiting para proteger endpoints de IA y API
 */

interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
    interval: number // Tiempo en ms
    maxRequests: number // Máximo de requests permitidos
}

/**
 * Rate limiter basado en IP o user ID
 */
export function rateLimit(config: RateLimitConfig) {
    const { interval, maxRequests } = config

    return {
        check: (identifier: string): { success: boolean; remaining: number; resetTime: number } => {
            const now = Date.now()
            const key = identifier

            // Si no existe o ya expiró, crear nuevo
            if (!store[key] || store[key].resetTime < now) {
                store[key] = {
                    count: 1,
                    resetTime: now + interval,
                }
                return {
                    success: true,
                    remaining: maxRequests - 1,
                    resetTime: store[key].resetTime,
                }
            }

            // Si ya alcanzó el límite
            if (store[key].count >= maxRequests) {
                return {
                    success: false,
                    remaining: 0,
                    resetTime: store[key].resetTime,
                }
            }

            // Incrementar contador
            store[key].count++

            return {
                success: true,
                remaining: maxRequests - store[key].count,
                resetTime: store[key].resetTime,
            }
        },
    }
}

/**
 * Límites específicos para diferentes tipos de endpoints
 */
export const rateLimits = {
    // IA - Colorimetría: 10 por día
    colorimetry: rateLimit({
        interval: 24 * 60 * 60 * 1000, // 24 horas
        maxRequests: 10,
    }),

    // IA - Outfits: 30 por día
    outfits: rateLimit({
        interval: 24 * 60 * 60 * 1000,
        maxRequests: 30,
    }),

    // API general: 100 por hora
    api: rateLimit({
        interval: 60 * 60 * 1000, // 1 hora
        maxRequests: 100,
    }),

    // Closet: 50 por hora
    closet: rateLimit({
        interval: 60 * 60 * 1000,
        maxRequests: 50,
    }),
}

/**
 * Cleanup de entradas expiradas (llamar periódicamente)
 */
export function cleanupExpiredEntries() {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    })
}

// Limpiar cada hora
setInterval(cleanupExpiredEntries, 60 * 60 * 1000)
