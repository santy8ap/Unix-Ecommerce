"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  Star,
  TrendingUp,
  Sparkles,
  Wand2,
  Palette,
  ShoppingBag,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";
import { useSession } from "next-auth/react";
import { parseJSON } from "@/lib/utils";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturesSection from "@/components/layout/FeaturesSection";
import ProductCard from "@/components/products/ProductCard";

// Lazy load componentes pesados para mejor performance
const RecentlyViewedProducts = dynamic(
  () => import("@/components/products/RecentlyViewedProducts"),
  {
    loading: () => (
      <div className="h-64 animate-pulse bg-slate-900 rounded-xl" />
    ),
    ssr: true,
  }
);

const NewsletterSignup = dynamic(
  () => import("@/components/layout/NewsletterSignup"),
  {
    loading: () => (
      <div className="h-32 animate-pulse bg-slate-900 rounded-xl" />
    ),
    ssr: false, // No necesita SSR
  }
);

const ProductComparison = dynamic(
  () => import("@/components/products/ProductComparison"),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-slate-900 rounded-xl" />
    ),
    ssr: false,
  }
);

interface HomeClientProps {
  featuredProducts: Product[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
    },
  },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomeClient({ featuredProducts }: HomeClientProps) {
  const { t } = useLanguage();
  const { data: session } = useSession();

  // Parallax & Scroll Hooks
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Auto-Scroll Carousel Logic
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && carouselRef.current) {
        const { current } = carouselRef;
        const maxScrollLeft = current.scrollWidth - current.clientWidth;

        if (current.scrollLeft >= maxScrollLeft - 10) {
          current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          current.scrollBy({ left: 340, behavior: "smooth" }); // ~Card width + gap
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden"
      ref={targetRef}
    >
      <Navbar />

      <main>
        {/* 1. HERO SECTION - Premium Landing with UNIX Logo */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {/* Animated Background Blobs */}
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob" />
            <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_70%,transparent_110%)] opacity-30" />
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-left space-y-8">
                {/* Animated Badge */}
                <motion.div variants={fadeInUp}>
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md shadow-lg shadow-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide uppercase">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    {t("home.hero.badge") || "Nueva Colección AI 2025"}
                  </span>
                </motion.div>

                {/* Main Titles */}
                <motion.div variants={fadeInUp} className="space-y-4">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05]">
                    <span className="block text-white drop-shadow-lg mb-3">
                      Moda Única,
                    </span>

                    {/* Advanced AI Text Effect */}
                    <div className="relative inline-block">
                      {/* Ambient Glow */}
                      <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-2xl animate-pulse" />

                      {/* Main Text */}
                      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 via-pink-300 to-indigo-300 animate-text-flow">
                        CREADA CON IA
                      </span>

                      {/* Underline Accent */}
                      <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60 rounded-full" />
                    </div>
                  </h1>

                  <p className="text-xl md:text-2xl text-slate-300 max-w-xl lg:max-w-none leading-relaxed font-medium">
                    {t("home.hero.description") ||
                      "Descubre prendas exclusivas diseñadas por algoritmos inteligentes que entienden tu estilo único."}
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link href="/productos">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group w-full sm:w-auto btn-primary px-8 py-4 text-lg shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-3 text-white font-bold"
                    >
                      Explorar Colección
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link href="/closet">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-8 py-4 bg-slate-800/60 backdrop-blur-md border-2 border-slate-700 rounded-xl font-bold text-slate-200 flex items-center justify-center gap-3 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                    >
                      <Wand2 className="w-5 h-5 text-purple-400" />
                      Asistente IA
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Stats Strip */}
                <motion.div
                  variants={fadeInUp}
                  className="pt-8 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
                >
                  {[
                    { label: "Usuarios", val: "2K+" },
                    { label: "Diseños", val: "500+" },
                    { label: "Rating", val: "4.9/5" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <div className="text-2xl md:text-3xl font-black text-white mb-1">
                        {stat.val}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right Side - UNIX Logo Image with Stunning Effects */}
              <motion.div
                variants={fadeInUp}
                className="relative perspective-1000"
              >
                {/* Glow Container */}
                <div className="relative">
                  {/* Animated Outer Glow */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-[80px] animate-pulse-glow" />

                  {/* Inner Glow Ring */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-[40px] animate-gradient" />

                  {/* Main Logo Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/30 border border-indigo-500/20"
                  >
                    <motion.img
                      src="/unix-hero-logo.jpg"
                      alt="UNIX - Tu Estilo Potenciado Por IA"
                      className="w-full h-auto relative z-10"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Shimmer Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"
                  />
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-8 -left-8 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <span className="text-xs font-semibold uppercase tracking-wider">
                Descubre Más
              </span>
              <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-2 bg-current rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. AI BENTO GRID SECTION - Interactive & Modern */}
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
              >
                Poder <span className="text-indigo-400">Ilimitado</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-300 max-w-2xl mx-auto"
              >
                Nuestra suite de herramientas de IA personaliza cada aspecto de
                tu experiencia de moda.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Card 1: Colorimetry (Large) */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-10 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                      <Palette className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      Análisis de Colorimetría
                    </h3>
                    <p className="text-slate-400">
                      Sube tu foto y deja que nuestra IA detecte tu paleta de
                      colores perfecta al instante.
                    </p>
                  </div>
                  <Link
                    href="/closet"
                    className="text-indigo-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all"
                  >
                    Probar ahora <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {/* Abstract Visual Decoration */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </motion.div>

              {/* Card 2: Smart Closet (Tall) */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:row-span-2 relative group overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-xl"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                <div className="p-10 h-full flex flex-col justify-end relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Smart Closet</h3>
                  <p className="text-slate-300 mb-6">
                    Organiza, visualiza y planifica tus outfits digitalmente.
                  </p>
                  <Link href="/closet">
                    <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                      Acceder
                    </button>
                  </Link>
                </div>
              </motion.div>

              {/* Card 3: Outfits (Standard) */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative group overflow-hidden rounded-[2rem] bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              >
                <div className="p-10 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <Wand2 className="w-8 h-8 mb-6 text-indigo-200" />
                    <h3 className="text-2xl font-bold mb-2">
                      Generador de Outfits
                    </h3>
                    <p className="text-indigo-100 text-sm">
                      ¿No sabes qué ponerte? Deja que la magia suceda.
                    </p>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
              </motion.div>

              {/* Card 4: Community (Standard) */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative group overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 shadow-sm"
              >
                <div className="p-10 h-full flex flex-col justify-center items-center text-center relative z-10">
                  <div className="flex -space-x-3 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-400"
                      >
                        U{i}
                      </div>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg text-white">
                    Únete a la comunidad
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Comparte tus creaciones únicas.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED PRODUCTS - Horizontal Parallax Scroll */}
        <section className="py-32 bg-slate-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex items-end justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs"
              >
                <TrendingUp className="w-4 h-4" />
                Tendencias Globales
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-black text-white tracking-tighter"
              >
                Los Más{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Deseados
                </span>
              </motion.h2>
            </div>
            <Link href="/productos" className="hidden md:block">
              <button className="group flex items-center gap-2 px-6 py-3 rounded-full border border-slate-800 hover:border-indigo-500 hover:bg-slate-900 transition-all font-bold text-slate-300">
                Ver todo{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Draggable/Scrollable Container */}
          <motion.div
            ref={carouselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex gap-8 overflow-x-auto pb-12 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory scrollbar-hide max-w-[1920px] mx-auto"
          >
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, i) => {
                const parsedProduct = {
                  ...product,
                  images: parseJSON(product.images, []),
                  sizes: parseJSON(product.sizes, []),
                  colors: parseJSON(product.colors, []),
                };
                return (
                  <div
                    key={product.id}
                    className="min-w-[300px] md:min-w-[380px] snap-center"
                  >
                    <ProductCard product={parsedProduct} />
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-20 text-slate-400">
                No hay productos destacados por el momento.
              </div>
            )}

            {/* 'View All' spacer card */}
            <div className="min-w-[200px] flex items-center justify-center">
              <Link
                href="/productos"
                className="w-full h-[400px] rounded-[2rem] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-900 transition-all font-bold gap-4 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition-colors shadow-sm">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
                Ver catálogo completo
              </Link>
            </div>
          </motion.div>
        </section>

        <FeaturesSection />

        {/* 4. NEWSLETTER - Full Width with Glassmorphism */}
        <section className="relative py-32 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-slate-900 z-0">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Únete a la Revolución de la Moda
              </h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Sé el primero en experimentar nuevas features de IA y recibir
                drops exclusivos.
              </p>
              <div className="max-w-md mx-auto">
                <NewsletterSignup variant="inline" />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="bg-slate-950 pt-20 pb-10">
          <RecentlyViewedProducts />
        </div>
      </main>

      <Footer />
    </div>
  );
}
