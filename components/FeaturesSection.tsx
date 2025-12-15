'use client'

import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { Truck, Shield, DollarSign, Award, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export default function FeaturesSection() {
    const { t } = useLanguage()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    const features = [
        {
            icon: Truck,
            title: t('home.features.shipping.title'),
            desc: t('home.features.shipping.desc'),
            className: "md:col-span-2",
        },
        {
            icon: Shield,
            title: t('home.features.secure.title'),
            desc: t('home.features.secure.desc'),
            className: "md:col-span-1",
        },
        {
            icon: DollarSign,
            title: t('home.features.price.title'),
            desc: t('home.features.price.desc'),
            className: "md:col-span-1",
        },
        {
            icon: Award,
            title: t('home.features.quality.title'),
            desc: t('home.features.quality.desc'),
            className: "md:col-span-2",
        }
    ]

    return (
        <section ref={ref} className="py-24 bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950">
                <div className="absolute h-full w-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl p-8 bg-slate-900 border border-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300",
                                feature.className
                            )}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                                <ArrowUpRight className="w-6 h-6 text-primary" />
                            </div>

                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <feature.icon className="w-6 h-6" strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}