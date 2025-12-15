'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Shirt, Star, Zap, ShoppingBag } from "lucide-react"

function SignInContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [redirecting, setRedirecting] = useState(false)

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (status === "authenticated" && !redirecting) {
      setRedirecting(true)
      // Pequeño delay para evitar el loop
      setTimeout(() => {
        window.location.href = callbackUrl
      }, 1000)
    }
  }, [status, callbackUrl, redirecting])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (status === "authenticated" || redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="text-center z-10">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 shadow-xl shadow-indigo-500/20 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-white">✓</span>
            )}
          </div>
          <h2 className="text-3xl font-black mb-2 text-white">¡Bienvenido de nuevo!</h2>
          <p className="text-slate-400 mb-8">Te estamos redirigiendo...</p>
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] delay-1000" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex z-10 m-4 md:m-8 rounded-3xl overflow-hidden min-h-[600px]">
        {/* Left Side - Hero / Branding */}
        <div className="hidden lg:flex flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 relative flex-col justify-between p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-black text-white">U</span>
            </div>
            <span className="font-bold text-xl text-white">UNIX</span>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-5xl font-black text-white leading-tight">
              Moda única,<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Estilo auténtico</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Descubre nuestra colección exclusiva potenciada por IA con análisis de colorimetría y generación de outfits personalizados.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10 mt-12">
            {[
              { title: 'IA Integrada', desc: 'Análisis de estilo', icon: Star },
              { title: 'Envíos Rápidos', desc: 'Entrega en 24h', icon: Zap },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                <item.icon className="w-6 h-6 text-indigo-400 mb-2" />
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 relative bg-slate-900/80 backdrop-blur-xl border border-slate-800">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2">Iniciar Sesión</h2>
              <p className="text-slate-400">Accede para gestionar tus pedidos y usar las funciones IA</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => signIn("google", { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all duration-200 group relative overflow-hidden shadow-lg hover:shadow-xl"
              >
                <div className="w-5 h-5 relative">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="relative z-10">Continuar con Google</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">Protegido por SSL</span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500">
              Al continuar, aceptas nuestros <a href="#" className="underline hover:text-indigo-400 transition-colors">Términos de Servicio</a> y <a href="#" className="underline hover:text-indigo-400 transition-colors">Política de Privacidad</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}