'use client'

import { motion } from 'framer-motion'

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'premium'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  animated?: boolean
}

const variants = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  success: 'bg-green-500/10 text-green-400 border-green-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  premium: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/30'
}

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export default function Badge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  animated = false
}: BadgeProps) {
  const content = (
    <span className={`inline-flex items-center gap-1.5 font-semibold border rounded-full ${variants[variant]} ${sizes[size]}`}>
      {icon}
      {label}
    </span>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}
