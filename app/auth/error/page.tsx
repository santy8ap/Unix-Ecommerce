'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const getErrorMessage = () => {
        switch (error) {
            case 'Configuration':
                return 'Hay un problema con la configuración del servidor. Por favor contacta al administrador.'
            case 'AccessDenied':
                return 'No tienes permiso para acceder a este recurso.'
            case 'Verification':
                return 'El token de verificación ha expirado o ya fue usado.'
            case 'OAuthSignin':
            case 'OAuthCallback':
            case 'OAuthCreateAccount':
            case 'EmailCreateAccount':
            case 'Callback':
                return 'Error al autenticarse con Google. Por favor intenta de nuevo.'
            case 'OAuthAccountNotLinked':
                return 'Este correo ya está registrado con otro método de autenticación.'
            case 'EmailSignin':
                return 'El enlace de inicio de sesión por correo no es válido.'
            case 'CredentialsSignin':
                return 'Las credenciales proporcionadas son incorrectas.'
            case 'SessionRequired':
                return 'Debes iniciar sesión para acceder a esta página.'
            default:
                return 'Ha ocurrido un error durante la autenticación. Por favor intenta de nuevo.'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/20">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-black text-white text-center mb-3">
                        Error de Autenticación
                    </h1>

                    {/* Error Message */}
                    <p className="text-slate-400 text-center mb-8">
                        {getErrorMessage()}
                    </p>

                    {/* Error Code (if available) */}
                    {error && (
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-6">
                            <p className="text-xs text-slate-500 mb-1">Código de error:</p>
                            <p className="text-sm font-mono text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/auth/signin"
                            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <ArrowLeft className="w-5 h-5" />
                                Volver a Iniciar Sesión
                            </div>
                        </Link>

                        <Link
                            href="/"
                            className="block w-full bg-slate-800 text-white text-center py-3 px-6 rounded-xl font-bold border border-slate-700 hover:bg-slate-700 transition-all"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Home className="w-5 h-5" />
                                Ir al Inicio
                            </div>
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="text-center text-xs text-slate-500 mt-6">
                        Si el problema persiste, contacta a{' '}
                        <a href="mailto:support@redestampacion.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            soporte
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ErrorContent />
        </Suspense>
    )
}
