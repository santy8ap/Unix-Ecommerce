'use client'

import { motion } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

type AlertVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  description: string
  closable?: boolean
  onClose?: () => void
  icon?: boolean
}

const variants = {
  default: {
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-800',
    icon: 'text-gray-600',
    button: 'text-gray-600 hover:bg-gray-100'
  },
  success: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600',
    button: 'text-green-600 hover:bg-green-100'
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600',
    button: 'text-red-600 hover:bg-red-100'
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-600',
    button: 'text-yellow-600 hover:bg-yellow-100'
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600',
    button: 'text-blue-600 hover:bg-blue-100'
  }
}

const iconMap = {
  default: AlertCircle,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

export default function Alert({
  variant = 'default',
  title,
  description,
  closable = false,
  onClose,
  icon = true
}: AlertProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  if (!isOpen) return null

  const style = variants[variant]
  const IconComponent = iconMap[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-lg p-4 flex gap-4 ${style.bg}`}
    >
      {icon && (
        <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
      )}

      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold mb-1 ${style.text}`}>
            {title}
          </h4>
        )}
        <p className={`text-sm ${style.text}`}>
          {description}
        </p>
      </div>

      {closable && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className={`flex-shrink-0 p-1 rounded transition ${style.button}`}
        >
          <X className="w-5 h-5" />
        </motion.button>
      )}
    </motion.div>
  )
}
