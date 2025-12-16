'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, ArrowRight, Sparkles } from 'lucide-react'
import NewsletterSignup from './NewsletterSignup'

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const exploreLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.products'), href: '/productos' },
    { label: t('nav.collections'), href: '/colecciones' },
    { label: t('footer.faq'), href: '/faq' }
  ]

  const helpLinks = [
    { label: t('footer.shipping'), href: '#' },
    { label: t('footer.contact'), href: '#' },
    { label: t('footer.privacy'), href: '#' },
    { label: t('footer.terms'), href: '#' }
  ]

  return (
    <footer className="relative bg-slate-950 text-slate-100 mt-auto overflow-hidden border-t border-slate-800">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8"
        >
          {/* Brand Section (4 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block group">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <span className="text-white group-hover:text-primary transition-colors">
                  UNIX
                </span>
                <Sparkles className="w-4 h-4 text-primary" />
              </h3>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 bg-slate-900 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Explore Links (2 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 lg:col-start-6 space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm transition-all"
                  >
                    <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help Links (2 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer.help')}
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm transition-all"
                  >
                    <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter (4 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer.newsletter')}
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('footer.newsletterDesc')}
            </p>
            <NewsletterSignup variant="footer" />
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}