/**
 * Payment Method Selector Component
 * Allows users to choose their preferred payment method
 */

'use client'

import { useState } from 'react'
import { CreditCard, Bitcoin, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PaymentMethod } from '@/lib/payments/config'
import { PAYMENT_METHODS, getEnabledPaymentMethods } from '@/lib/payments/config'

interface PaymentMethodSelectorProps {
    onSelectMethod: (method: PaymentMethod) => void
    selectedMethod?: PaymentMethod
}

const PAYMENT_OPTIONS = [
    {
        id: PAYMENT_METHODS.PAYPAL,
        name: 'PayPal',
        description: 'Paga de forma segura con tu cuenta PayPal',
        icon: Wallet,
        color: 'from-blue-500 to-blue-600',
        badge: 'Popular',
    },
    {
        id: PAYMENT_METHODS.STRIPE,
        name: 'Tarjeta de Crédito/Débito',
        description: 'Visa, Mastercard, American Express',
        icon: CreditCard,
        color: 'from-purple-500 to-purple-600',
        badge: 'Rápido',
    },
    {
        id: PAYMENT_METHODS.CRYPTO,
        name: 'Bitcoin / Criptomonedas',
        description: 'BTC, ETH, USDC, y más',
        icon: Bitcoin,
        color: 'from-orange-500 to-orange-600',
        badge: 'Anónimo',
    },
]

export default function PaymentMethodSelector({
    onSelectMethod,
    selectedMethod,
}: PaymentMethodSelectorProps) {
    const [selected, setSelected] = useState<PaymentMethod | undefined>(selectedMethod)
    const enabledMethods = getEnabledPaymentMethods()

    const handleSelect = (method: PaymentMethod) => {
        setSelected(method)
        onSelectMethod(method)
    }

    // Filter only enabled payment methods
    const availableOptions = PAYMENT_OPTIONS.filter((option) =>
        enabledMethods.includes(option.id)
    )

    if (availableOptions.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-yellow-800 font-semibold">
                    ⚠️ No hay métodos de pago configurados
                </p>
                <p className="text-yellow-600 text-sm mt-2">
                    Por favor contacta al administrador
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
                Método de Pago
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = selected === option.id

                    return (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(option.id)}
                            className={`relative p-6 rounded-xl border-2 transition-all text-left ${isSelected
                                    ? 'border-red-500 bg-red-50 shadow-lg shadow-red-100'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                }`}
                        >
                            {/* Badge */}
                            {option.badge && (
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${option.color} text-white`}
                                    >
                                        {option.badge}
                                    </span>
                                </div>
                            )}

                            {/* Icon */}
                            <div
                                className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${option.color} mb-4`}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <h4 className="font-bold text-gray-900 mb-1">{option.name}</h4>
                            <p className="text-sm text-gray-600">{option.description}</p>

                            {/* Selection indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 left-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {selected && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
                >
                    <svg
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm text-green-800">
                        <span className="font-semibold">Método seleccionado:</span>{' '}
                        {availableOptions.find((opt) => opt.id === selected)?.name}
                    </p>
                </motion.div>
            )}
        </div>
    )
}
