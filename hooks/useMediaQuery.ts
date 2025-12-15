/**
 * useMediaQuery Hook
 * Detecta breakpoints y características de dispositivo
 */

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)

        // Set initial value
        setMatches(media.matches)

        // Create listener
        const listener = (e: MediaQueryListEvent) => {
            setMatches(e.matches)
        }

        // Add listener
        if (media.addEventListener) {
            media.addEventListener('change', listener)
        } else {
            // Fallback para navegadores antiguos
            media.addListener(listener)
        }

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', listener)
            } else {
                media.removeListener(listener)
            }
        }
    }, [query])

    return matches
}

// Hooks pre-configurados para breakpoints comunes
export function useIsMobile() {
    return useMediaQuery('(max-width: 768px)')
}

export function useIsTablet() {
    return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}

export function useIsDesktop() {
    return useMediaQuery('(min-width: 1025px)')
}

export function usePrefersDarkMode() {
    return useMediaQuery('(prefers-color-scheme: dark)')
}

export function usePrefersReducedMotion() {
    return useMediaQuery('(prefers-reduced-motion: reduce)')
}
