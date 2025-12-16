'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BitcoinPayment from '@/components/payments/BitcoinPayment'
import { Lock, Package, MapPin, User, ArrowLeft, Bitcoin } from 'lucide-react'
import { checkoutSchema } from '@/lib/validations/schemas'
import Image from 'next/image'

interface FormData {
    shippingName: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingZip: string
    phone?: string
}

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const { data: session } = useSession()
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
    const [shippingData, setShippingData] = useState<FormData | null>(null)
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(checkoutSchema),
        defaultValues: {
            shippingName: session?.user?.name || '',
            shippingEmail: session?.user?.email || '',
            shippingAddress: '',
            shippingCity: '',
            shippingZip: '',
            phone: '',
        },
        mode: 'onBlur',
    })

    const onSubmitShipping = async (formData: FormData) => {
        setShippingData(formData)
        setStep('payment')
    }

    const createPendingOrder = async (): Promise<string> => {
        if (currentOrderId) return currentOrderId

        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color,
                })),
                shipping: {
                    name: shippingData!.shippingName,
                    email: shippingData!.shippingEmail,
                    address: shippingData!.shippingAddress,
                    city: shippingData!.shippingCity,
                    zip: shippingData!.shippingZip,
                    phone: shippingData!.phone,
                },
                paymentMethod: 'bitcoin',
                status: 'PENDING'
            }

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            })

            if (!response.ok) throw new Error('Error creating order')

            const order = await response.json()
            setCurrentOrderId(order.id)
            return order.id
        } catch (error) {
            console.error(error)
            toast.error('Error al iniciar la orden')
            throw error
        }
    }

    const handlePaymentSuccess = async (transactionId: string) => {
        clearCart()
        // If we are here, polling confirmed payment success.
        // We already have currentOrderId.
        toast.success('¡Orden confirmada con éxito!')
        if (currentOrderId) {
            router.push(`/mis-ordenes?orderId=${currentOrderId}`)
        } else {
            // Fallback just in case, though unlikely if flow is correct
            router.push('/mis-ordenes')
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950">
                <Navbar />
                <div className="h-screen flex flex-col items-center justify-center text-center px-4">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                        <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h1>
                    <p className="text-slate-400 mb-8">Parece que no has agregado nada aún.</p>
                    <button
                        onClick={() => router.push('/productos')}
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all"
                    >
                        Empezar a Comprar
                    </button>
                </div>
            </div>
        )
    }

    const taxAmount = total * 0.09
    const finalTotal = total + taxAmount

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => step === 'payment' ? setStep('shipping') : router.back()} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white">Checkout</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {step === 'shipping' ? 'Paso 1: Información de envío' : 'Paso 2: Pago con Bitcoin'}
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-12 max-w-md">
                    <div className={`flex items-center gap-2 flex-1 ${step === 'shipping' ? 'text-red-500' : 'text-green-500'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 'shipping' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                            {step === 'payment' ? '✓' : '1'}
                        </div>
                        <span className="text-sm font-bold">Envío</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-700" />
                    <div className={`flex items-center gap-2 flex-1 ${step === 'payment' ? 'text-red-500' : 'text-slate-500'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 'payment' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            2
                        </div>
                        <span className="text-sm font-bold">Pago</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-7">
                        {step === 'shipping' ? (
                            <form onSubmit={handleSubmit(onSubmitShipping)} className="space-y-6">
                                {/* Contact Info */}
                                <section className="bg-slate-900/50 backdrop-blur border border-slate-800 p-8 rounded-2xl">
                                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5 text-red-500" />
                                        Información de Contacto
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
                                            <input
                                                {...register('shippingName')}
                                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white  rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                                                placeholder="Juan Pérez"
                                            />
                                            {errors.shippingName && <p className="text-red-400 text-xs">{errors.shippingName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Email</label>
                                            <input
                                                {...register('shippingEmail')}
                                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                                                placeholder="juan@example.com"
                                            />
                                            {errors.shippingEmail && <p className="text-red-400 text-xs">{errors.shippingEmail.message}</p>}
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-slate-300">Teléfono (Opcional)</label>
                                            <input
                                                {...register('phone')}
                                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Shipping Address */}
                                <section className="bg-slate-900/50 backdrop-blur border border-slate-800 p-8 rounded-2xl">
                                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-red-500" />
                                        Dirección de Envío
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Dirección</label>
                                            <input
                                                {...register('shippingAddress')}
                                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                                                placeholder="Calle Principal 123, Apto 4B"
                                            />
                                            {errors.shippingAddress && <p className="text-red-400 text-xs">{errors.shippingAddress.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Ciudad</label>
                                                <input
                                                    {...register('shippingCity')}
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                                                    placeholder="Bogotá"
                                                />
                                                {errors.shippingCity && <p className="text-red-400 text-xs">{errors.shippingCity.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Código Postal</label>
                                                <input
                                                    {...register('shippingZip')}
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
                                                    placeholder="110111"
                                                />
                                                {errors.shippingZip && <p className="text-red-400 text-xs">{errors.shippingZip.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                                >
                                    Continuar al Pago
                                </button>
                            </form>
                        ) : (
                            <BitcoinPayment
                                amount={finalTotal}
                                items={items.map(item => ({
                                    name: item.name,
                                    quantity: item.quantity,
                                    price: item.price,
                                    size: item.size,
                                    color: item.color,
                                }))}
                                shipping={shippingData!}
                                onSuccess={handlePaymentSuccess}
                                onCancel={() => setStep('shipping')}
                                onBeforePayment={createPendingOrder}
                            />
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32">
                            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-8 rounded-2xl">
                                <h2 className="text-lg font-bold text-white mb-6">Resumen de Orden</h2>

                                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-slate-400 mt-1">{item.size} / {item.color}</p>
                                                <p className="text-xs text-slate-400">Cant: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-slate-800">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-white">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Envío</span>
                                        <span className="text-green-400 font-bold text-xs bg-green-500/10 px-2 py-1 rounded-full">Gratis</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Impuestos</span>
                                        <span className="font-medium text-white">${taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4 border-t border-slate-800">
                                        <span className="font-bold text-white">Total</span>
                                        <span className="text-2xl font-black text-white">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <Lock className="w-3 h-3" />
                                    Pago seguro con Bitcoin
                                </div>

                                {step === 'payment' && (
                                    <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                        <p className="text-xs text-orange-300 flex items-center gap-2">
                                            <Bitcoin className="w-4 h-4" />
                                            Acepta: Bitcoin, Ethereum, USDC, y más cryptos
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}