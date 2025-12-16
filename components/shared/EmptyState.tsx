'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
  variant?: 'default' | 'error' | 'info'
}

const variants = {
  default: 'from-slate-900/50 to-slate-800/50 border-slate-700',
  error: 'from-red-900/20 to-red-800/20 border-red-700/50',
  info: 'from-blue-900/20 to-blue-800/20 border-blue-700/50'
}

const iconVariants = {
  default: 'text-slate-600',
  error: 'text-red-500',
  info: 'text-blue-500'
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  variant = 'default'
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`max-w-lg bg-gradient-to-br ${variants[variant]} backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed shadow-xl`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6 flex justify-center"
      >
        <Icon className={`w-24 h-24 ${iconVariants[variant]}`} strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-2xl font-black text-white mb-3">
        {title}
      </h3>
      <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-block btn-primary"
          >
            {actionLabel}
          </Link>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={actionOnClick}
            className="btn-primary"
          >
            {actionLabel}
          </motion.button>
        )
      )}
    </motion.div>
  )
}
