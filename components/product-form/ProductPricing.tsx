'use client'

import { motion } from 'framer-motion'
import FormInput from './FormInput'
import { Tag, Check } from 'lucide-react'

interface ProductPricingProps {
    formData: {
        price: number | string
        stock: number | string
        featured: boolean
        active: boolean
    }
    handleFieldChange: (field: string, value: any) => void
    errors: Record<string, string>
    touched: Record<string, boolean>
}

export default function ProductPricing({
    formData,
    handleFieldChange,
    errors,
    touched
}: ProductPricingProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <Tag className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-base font-black text-white">Precio e Inventario</h3>
                    <p className="text-xs text-slate-400">Establece precio, stock y visibilidad</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                    label="Precio ($)"
                    field="price"
                    type="number"
                    value={formData.price}
                    onChange={(value) => handleFieldChange('price', value)}
                    error={errors.price}
                    touched={touched.price}
                    placeholder="0.00"
                    required
                />
                <FormInput
                    label="Cantidad en Stock"
                    field="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(value) => handleFieldChange('stock', value)}
                    error={errors.stock}
                    touched={touched.stock}
                    placeholder="0"
                    required
                />

                <div className="space-y-3">
                    <label className="block text-sm font-black text-white">Visibilidad</label>
                    <div className="grid grid-cols-1 gap-3">
                        <motion.label
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.featured
                                ? 'border-yellow-500/50 bg-yellow-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.featured ? 'bg-yellow-500 border-yellow-500' : 'border-slate-600 bg-slate-900'
                                }`}>
                                {formData.featured && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => handleFieldChange('featured', e.target.checked)}
                                className="hidden"
                            />
                            <div>
                                <span className="block text-sm font-bold text-white">Producto Destacado</span>
                                <span className="block text-xs text-slate-400">Mostrar en página principal</span>
                            </div>
                        </motion.label>

                        <motion.label
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.active
                                ? 'border-green-500/50 bg-green-500/10'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.active ? 'bg-green-500 border-green-500' : 'border-slate-600 bg-slate-900'
                                }`}>
                                {formData.active && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => handleFieldChange('active', e.target.checked)}
                                className="hidden"
                            />
                            <div>
                                <span className="block text-sm font-bold text-white">Estado Activo</span>
                                <span className="block text-xs text-slate-400">Visible para clientes</span>
                            </div>
                        </motion.label>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
