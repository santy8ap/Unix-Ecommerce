/**
 * Página del Generador de Outfits con IA
 */

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import OutfitGenerator from '@/components/ai/OutfitGenerator'
import OnboardingFlow from '@/components/OnboardingFlow'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function OutfitsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [needsOnboarding, setNeedsOnboarding] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

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

    const handleOnboardingComplete = () => {
        setNeedsOnboarding(false)
    }

    const [showLongLoadingMessage, setShowLongLoadingMessage] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === 'loading' || isChecking) {
                setShowLongLoadingMessage(true)
            }
        }, 5000)

        return () => clearTimeout(timer)
    }, [status, isChecking])

    if (status === 'loading' || isChecking) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Cargando...</p>

                    {showLongLoadingMessage && (
                        <div className="mt-8 animate-fade-in text-center max-w-sm">
                            <p className="text-amber-400 text-sm mb-4">Esto está tardando más de lo habitual.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm border border-slate-700 transition font-bold"
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
        return <OnboardingFlow onComplete={handleOnboardingComplete} />
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <OutfitGenerator />
            <Footer />
        </div>
    )
}
