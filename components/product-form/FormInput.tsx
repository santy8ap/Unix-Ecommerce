'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface FormInputProps {
    label: string
    field: string
    value: string | number | undefined
    onChange: (value: string | number) => void
    error?: string
    touched?: boolean
    type?: string
    placeholder?: string
    required?: boolean
    children?: React.ReactNode
}

export default function FormInput({
    label,
    field,
    value,
    onChange,
    error,
    touched,
    type = 'text',
    placeholder,
    required = false,
    children = null
}: FormInputProps) {
    const hasError = touched && error

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="block text-sm font-bold text-slate-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children || (
                <input
                    type={type}
                    step={type === 'number' ? '0.01' : undefined}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none font-medium placeholder-slate-400 ${hasError
                            ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500 text-red-900'
                            : 'border-slate-200 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 hover:border-slate-300 text-slate-900'
                        }`}
                    placeholder={placeholder}
                />
            )}
            {hasError && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-red-500 flex items-center gap-1 font-medium"
                >
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </motion.p>
            )}
        </motion.div>
    )
}
