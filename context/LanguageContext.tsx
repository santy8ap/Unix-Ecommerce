'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import esTranslations from '@/i18n/messages/es.json'
import enTranslations from '@/i18n/messages/en.json'

type Locale = 'es' | 'en'

type LanguageContextType = {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string, params?: Record<string, string | number>) => string
    isLoaded: boolean
}

const translations = {
    es: esTranslations,
    en: enTranslations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('es')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadLocale = () => {
            try {
                const savedLocale = localStorage.getItem('locale') as Locale
                if (savedLocale && (savedLocale === 'es' || savedLocale === 'en')) {
                    setLocaleState(savedLocale)
                }
            } catch (error) {
                console.error('Error loading locale:', error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadLocale()
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        try {
            localStorage.setItem('locale', newLocale)
            // Update HTML lang attribute
            document.documentElement.lang = newLocale
        } catch (error) {
            console.error('Error saving locale:', error)
        }
    }

    const t = (key: string, params?: Record<string, string | number>): string => {
        const keys = key.split('.')
        let value: any = translations[locale]

        for (const k of keys) {
            value = value?.[k]
        }

        // If translation not found, return the key
        if (typeof value !== 'string') {
            console.warn(`Translation not found for key: ${key}`)
            return key
        }

        // Replace parameters if provided
        if (params) {
            return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
                return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue))
            }, value)
        }

        return value
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, isLoaded }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider')
    }
    return context
}