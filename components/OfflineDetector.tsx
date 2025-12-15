/**
 * Offline Detector Component
 * Muestra banner cuando la conexión se pierde
 */

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'

export default function OfflineDetector() {
    const [isOnline, setIsOnline] = useState(true)
    const [wasOffline, setWasOffline] = useState(false)

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            setWasOffline(true)

            // Hide "back online" message after 3 seconds
            setTimeout(() => {
                setWasOffline(false)
            }, 3000)
        }

        const handleOffline = () => {
            setIsOnline(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white py-3 px-4 shadow-lg"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                        <WifiOff className="w-5 h-5" />
                        <p className="font-bold text-sm">
                            Sin conexión a Internet. Algunas funciones pueden no estar disponibles.
                        </p>
                    </div>
                </motion.div>
            )}

            {isOnline && wasOffline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-green-600 text-white py-3 px-4 shadow-lg"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                        <Wifi className="w-5 h-5" />
                        <p className="font-bold text-sm">
                            Conexión restaurada
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
