
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getProductImage(images: string | string[], index = 0): string {
    if (Array.isArray(images)) {
        return images[index] || '/placeholder.svg'
    }

    try {
        const parsed = JSON.parse(images)
        if (Array.isArray(parsed)) {
            return parsed[index] || '/placeholder.svg'
        }
        return images || '/placeholder.svg'
    } catch {
        return images || '/placeholder.svg'
    }
}

export function parseJSON<T>(json: string | T | undefined | null, fallback: T): T {
    if (json === null || json === undefined) return fallback
    if (typeof json !== 'string') return json as T
    try {
        return JSON.parse(json)
    } catch {
        return fallback
    }
}
