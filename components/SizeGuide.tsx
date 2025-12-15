'use client'

import { Ruler, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function SizeGuide() {
    const [isOpen, setIsOpen] = useState(false)

    const sizeChart = {
        XS: { chest: '81-86', waist: '66-71', hip: '86-91' },
        S: { chest: '86-91', waist: '71-76', hip: '91-96' },
        M: { chest: '91-97', waist: '76-81', hip: '96-102' },
        L: { chest: '97-102', waist: '81-86', hip: '102-107' },
        XL: { chest: '102-107', waist: '86-91', hip: '107-112' },
        XXL: { chest: '107-112', waist: '91-97', hip: '112-117' },
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition"
            >
                <Ruler className="w-4 h-4" />
                Guía de Tallas
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Guía de Tallas</h2>
                                    <p className="text-gray-600">
                                        Encuentra tu talla perfecta
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* How to Measure */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-blue-900 mb-2">
                                            Cómo Medir
                                        </h3>
                                        <ul className="space-y-2 text-sm text-blue-800">
                                            <li>
                                                <strong>Pecho:</strong> Mide alrededor de la parte más completa del pecho
                                            </li>
                                            <li>
                                                <strong>Cintura:</strong> Mide alrededor de la cintura natural
                                            </li>
                                            <li>
                                                <strong>Cadera:</strong> Mide alrededor de la parte más ancha de las caderas
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Size Chart */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-4 text-left font-bold text-gray-900 border border-gray-200">
                                                Talla
                                            </th>
                                            <th className="p-4 text-left font-bold text-gray-900 border border-gray-200">
                                                Pecho (cm)
                                            </th>
                                            <th className="p-4 text-left font-bold text-gray-900 border border-gray-200">
                                                Cintura (cm)
                                            </th>
                                            <th className="p-4 text-left font-bold text-gray-900 border border-gray-200">
                                                Cadera (cm)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(sizeChart).map(([size, measurements]) => (
                                            <tr key={size} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-bold text-red-600 border border-gray-200">
                                                    {size}
                                                </td>
                                                <td className="p-4 border border-gray-200">
                                                    {measurements.chest}
                                                </td>
                                                <td className="p-4 border border-gray-200">
                                                    {measurements.waist}
                                                </td>
                                                <td className="p-4 border border-gray-200">
                                                    {measurements.hip}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Conversion Table */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4">
                                    Tabla de Conversión Internacional
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 text-left font-bold text-gray-900 border border-gray-200">
                                                    US/MX
                                                </th>
                                                <th className="p-3 text-left font-bold text-gray-900 border border-gray-200">
                                                    EU
                                                </th>
                                                <th className="p-3 text-left font-bold text-gray-900 border border-gray-200">
                                                    UK
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="hover:bg-gray-50">
                                                <td className="p-3 border border-gray-200">XS</td>
                                                <td className="p-3 border border-gray-200">34</td>
                                                <td className="p-3 border border-gray-200">6</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="p-3 border border-gray-200">S</td>
                                                <td className="p-3 border border-gray-200">36</td>
                                                <td className="p-3 border border-gray-200">8</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="p-3 border border-gray-200">M</td>
                                                <td className="p-3 border border-gray-200">38</td>
                                                <td className="p-3 border border-gray-200">10</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="p-3 border border-gray-200">L</td>
                                                <td className="p-3 border border-gray-200">40</td>
                                                <td className="p-3 border border-gray-200">12</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="p-3 border border-gray-200">XL</td>
                                                <td className="p-3 border border-gray-200">42</td>
                                                <td className="p-3 border border-gray-200">14</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="p-3 border border-gray-200">XXL</td>
                                                <td className="p-3 border border-gray-200">44</td>
                                                <td className="p-3 border border-gray-200">16</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="mt-8 bg-gray-50 rounded-xl p-6">
                                <h3 className="font-bold mb-3">Consejos útiles</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Si estás entre dos tallas, te recomendamos elegir la talla mayor</li>
                                    <li>• Todas las medidas son aproximadas y pueden variar ligeramente</li>
                                    <li>• Consulta la descripción del producto para detalles específicos</li>
                                    <li>• ¿Dudas? Contáctanos y te ayudaremos a elegir tu talla</li>
                                </ul>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
