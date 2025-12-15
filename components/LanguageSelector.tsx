'use client'

import { useLanguage } from '@/context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸', shortName: 'ES' },
    { code: 'en', name: 'English', flag: '🇺🇸', shortName: 'EN' }
]

export default function LanguageSelector() {
    const { locale, setLocale } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all border border-slate-200 hover:border-slate-300 shadow-sm group"
            >
                <Globe className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                <span className="text-lg leading-none">{currentLanguage.flag}</span>
                <span className="hidden sm:inline text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {currentLanguage.shortName}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-2">
                            {languages.map((lang, index) => (
                                <motion.button
                                    key={lang.code}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 4 }}
                                    onClick={() => {
                                        setLocale(lang.code as 'es' | 'en')
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all rounded-lg group ${locale === lang.code
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                                        : 'hover:bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${locale === lang.code ? 'text-white' : 'text-slate-900 group-hover:text-slate-900'
                                                }`}>
                                                {lang.name}
                                            </span>
                                            <span className={`text-xs ${locale === lang.code ? 'text-red-100' : 'text-slate-500 group-hover:text-slate-600'
                                                }`}>
                                                {lang.shortName}
                                            </span>
                                        </div>
                                    </div>
                                    {locale === lang.code && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <Check className="w-3 h-3 text-red-600" strokeWidth={3} />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Hint */}
                        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                            <p className="text-[10px] text-slate-500 text-center">
                                Language / Idioma
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
