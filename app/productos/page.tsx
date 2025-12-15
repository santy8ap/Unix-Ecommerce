import { Suspense } from 'react'
import ProductsContent from './products-content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-blob" />
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md shadow-lg shadow-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide uppercase mb-8">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Colección Completa
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1]">
                        <span className="block text-white drop-shadow-lg mb-2">
                            Descubre Tu
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Estilo Único
                        </span>
                    </h1>

                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                        Explora nuestra colección completa de prendas diseñadas con IA. Más de 500 diseños únicos esperando por ti.
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 md:gap-12">
                        {[
                            { icon: TrendingUp, label: '500+ Diseños', color: 'text-indigo-400' },
                            { icon: Sparkles, label: 'IA Creativa', color: 'text-purple-400' },
                            { icon: Zap, label: 'Stock Diario', color: 'text-pink-400' }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                <span className="text-sm md:text-base font-bold text-slate-400">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center min-h-[50vh] bg-slate-950">
                    <Loading />
                </div>
            }>
                <ProductsContent />
            </Suspense>

            <Footer />
        </div>
    )
}