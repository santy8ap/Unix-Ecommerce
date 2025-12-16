/**
 * Página del Smart Closet
 */

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SmartCloset from '@/components/ai/SmartCloset'
import OnboardingFlow from '@/components/OnboardingFlow'
import AIStyleAssistant from '@/components/ai/AIStyleAssistant'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ClosetPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [needsOnboarding, setNeedsOnboarding] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [useAIChat, setUseAIChat] = useState(true) // Usar chat IA por defecto

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        } else if (status === 'authenticated') {
            checkOnboarding()
        }
    }, [status, router])

    const checkOnboarding = async () => {
        try {
            const response = await fetch('/api/users/preferences')
            if (response.ok) {
                const data = await response.json()
                setNeedsOnboarding(!data.preferences?.onboardingCompleted)
            }
        } catch (error) {
            console.error('Error checking onboarding:', error)
        } finally {
            setIsChecking(false)
        }
    }

    const handleOnboardingComplete = async (data?: any) => {
        // Si viene del chat IA, guardar los datos
        if (data) {
            try {
                await fetch('/api/users/preferences', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        skinTone: data.skinTone,
                        styleType: data.styleType,
                        onboardingCompleted: true,
                    }),
                })

                // Generar análisis de colorimetría
                await fetch('/api/ai/colorimetry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        skinTone: data.skinTone,
                        hairColor: data.preferences?.hairColor,
                        eyeColor: data.preferences?.eyeColor,
                        useAI: true,
                    }),
                })
            } catch (error) {
                console.error('Error saving onboarding data:', error)
            }
        }

        setNeedsOnboarding(false)
    }

    const [showLongLoadingMessage, setShowLongLoadingMessage] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === 'loading' || isChecking) {
                setShowLongLoadingMessage(true)
            }
        }, 5000) // Show message after 5 seconds

        return () => clearTimeout(timer)
    }, [status, isChecking])

    if (status === 'loading' || isChecking) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Cargando...</p>

                    {showLongLoadingMessage && (
                        <div className="mt-8 animate-fade-in text-center max-w-sm">
                            <p className="text-amber-400 text-sm mb-4">Esto está tardando más de lo habitual.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm border border-slate-700 transition"
                            >
                                Recargar página
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (needsOnboarding) {
        return useAIChat ? <AIStyleAssistant onComplete={handleOnboardingComplete} /> : <OnboardingFlow onComplete={handleOnboardingComplete} />
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <SmartCloset />
            <Footer />
        </div>
    )
}
