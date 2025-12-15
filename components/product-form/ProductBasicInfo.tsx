'use client'

import { motion } from 'framer-motion'
import FormInput from './FormInput'
import { FileText } from 'lucide-react'

interface ProductBasicInfoProps {
    formData: {
        name: string
        description: string
        category: string
    }
    handleFieldChange: (field: string, value: string | number) => void
    errors: Record<string, string>
    touched: Record<string, boolean>
    categories: string[]
}

export default function ProductBasicInfo({
    formData,
    handleFieldChange,
    errors,
    touched,
    categories
}: ProductBasicInfoProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-base font-black text-white">Información Básica</h3>
                    <p className="text-xs text-slate-400">Detalles y categorización del producto</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Nombre del Producto"
                    field="name"
                    value={formData.name}
                    onChange={(value) => handleFieldChange('name', value)}
                    error={errors.name}
                    touched={touched.name}
                    placeholder="ej. Camiseta Vintage de Algodón"
                    required
                />
                <FormInput
                    label="Categoría"
                    field="category"
                    value={formData.category}
                    onChange={(value) => handleFieldChange('category', value)}
                    error={errors.category}
                    touched={touched.category}
                    required
                >
                    <select
                        value={formData.category}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        className="w-full px-4 py-3.5 border border-slate-800 bg-slate-950 text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-700 transition cursor-pointer focus:outline-none appearance-none font-bold"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </FormInput>
            </div>

            <FormInput
                label="Descripción"
                field="description"
                value={formData.description}
                onChange={(value) => handleFieldChange('description', value)}
                error={errors.description}
                touched={touched.description}
                required
            >
                <textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3.5 border rounded-xl transition focus:outline-none resize-none text-white placeholder-slate-500 font-medium ${touched.description && errors.description
                        ? 'border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-800 bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-700'
                        }`}
                    placeholder="Describe las características, materiales y corte del producto..."
                />
            </FormInput>
        </motion.div>
    )
}
