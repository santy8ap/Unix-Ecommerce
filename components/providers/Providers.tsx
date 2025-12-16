'use client'

import { Toaster } from 'sonner'
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { WishlistProvider } from '@/context/WishlistContext'
import SessionProvider from './SessionProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <CartProvider>
                    <WishlistProvider>
                        {children}
                        <Toaster
                            position="top-right"
                            richColors
                            closeButton
                            expand={true}
                            theme="dark"
                            visibleToasts={3}
                            toastOptions={{
                                style: {
                                    background: '#0f172a',
                                    border: '1px solid #1e293b',
                                    color: '#f8fafc',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
                                },
                                duration: 4000,
                                classNames: {
                                    toast: 'flex gap-3 items-center',
                                    title: 'font-semibold text-white text-sm',
                                    description: 'text-xs text-slate-400 mt-1',
                                    actionButton: 'bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700 transition',
                                    cancelButton: 'bg-slate-800 text-slate-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-slate-700 transition',
                                    closeButton: 'absolute -top-2 -right-2 bg-slate-800 border border-slate-700 text-slate-400 rounded-full p-1 hover:bg-slate-700 hover:text-white transition',
                                },
                            }}
                        />
                    </WishlistProvider>
                </CartProvider>
            </LanguageProvider>
        </SessionProvider>
    )
}