'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ChevronDown, Search, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqData = [
    {
        category: 'Pedidos y Envíos',
        questions: [
            {
                q: '¿Cuánto tiempo tarda el envío?',
                a: 'Los pedidos se procesan en 1-2 días hábiles y el envío estándar tarda de 3-5 días hábiles. El envío express está disponible y llega en 1-2 días hábiles.',
            },
            {
                q: '¿Ofrecen envío gratuito?',
                a: 'Sí, ofrecemos envío gratuito en todos los pedidos mayores a $50. Para pedidos menores, el costo de envío es de $5.99.',
            },
            {
                q: '¿Puedo rastrear mi pedido?',
                a: 'Sí, recibirás un número de rastreo por email una vez que tu pedido sea enviado. También puedes ver el estado de tu pedido en la sección "Mis Órdenes".',
            },
            {
                q: '¿Realizan envíos internacionales?',
                a: 'Actualmente solo enviamos a nivel nacional. Estamos trabajando para expandir nuestros servicios internacionales pronto.',
            },
        ],
    },
    {
        category: 'Devoluciones y Cambios',
        questions: [
            {
                q: '¿Cuál es su política de devoluciones?',
                a: 'Aceptamos devoluciones dentro de los 30 días posteriores a la compra. Los productos deben estar sin usar, con etiquetas originales y en su empaque original.',
            },
            {
                q: '¿Cómo inicio una devolución?',
                a: 'Ve a "Mis Órdenes", selecciona el pedido y haz clic en "Solicitar Devolución". Sigue las instrucciones y recibirás una etiqueta de envío de devolución.',
            },
            {
                q: '¿Cuánto tarda el reembolso?',
                a: 'Una vez que recibamos tu devolución, procesaremos el reembolso en 3-5 días hábiles. El dinero aparecerá en tu método de pago original en 5-10 días hábiles.',
            },
        ],
    },
    {
        category: 'Productos',
        questions: [
            {
                q: '¿Cómo sé mi talla?',
                a: 'Cada página de producto tiene una guía de tallas detallada con medidas. También ofrecemos una tabla de conversión internacional. Si tienes dudas, contáctanos.',
            },
            {
                q: '¿Los colores son exactos a las fotos?',
                a: 'Hacemos nuestro mejor esfuerzo para mostrar colores precisos, pero pueden variar ligeramente según tu pantalla. Si tienes dudas, contáctanos para fotos adicionales.',
            },
            {
                q: '¿Puedo personalizar un producto?',
                a: 'Sí, ofrecemos servicios de personalización para pedidos grandes. Contáctanos con tus requerimientos y te enviaremos una cotización.',
            },
        ],
    },
    {
        category: 'Pagos',
        questions: [
            {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos Bitcoin y otras criptomonedas (Ethereum, USDC, Litecoin, Dogecoin, etc.) a través de Coinbase Commerce.',
            },
            {
                q: '¿Es seguro pagar con criptomonedas?',
                a: 'Sí, todos los pagos se procesan a través de Coinbase Commerce con encriptación SSL. No almacenamos información financiera en nuestros servidores.',
            },
            {
                q: '¿Puedo usar cupones de descuento?',
                a: 'Sí, puedes aplicar cupones de descuento en la página de checkout. Ingresa el código en el campo correspondiente antes de finalizar la compra.',
            },
        ],
    },
    {
        category: 'Cuenta y Servicios',
        questions: [
            {
                q: '¿Necesito crear una cuenta para comprar?',
                a: 'No es obligatorio, pero recomendamos crear una cuenta para rastrear pedidos, guardar direcciones y recibir ofertas exclusivas.',
            },
            {
                q: '¿Cómo cambio mi contraseña?',
                a: 'Si usas Google OAuth, tu cuenta está gestionada por Google. Para cuentas con email/contraseña, usa la opción "Olvidé mi contraseña" en la página de login.',
            },
            {
                q: '¿Cómo me suscribo al newsletter?',
                a: 'Puedes suscribirte en el footer del sitio o durante el checkout. Recibirás ofertas exclusivas, nuevos lanzamientos y contenido especial.',
            },
        ],
    },
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredFAQ = faqData
        .map((category) => ({
            ...category,
            questions: category.questions.filter(
                (q) =>
                    q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.a.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((category) => category.questions.length > 0)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <section className="pt-24 pb-12 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-5xl font-black mb-4">
                            Preguntas Frecuentes
                        </h1>
                        <p className="text-xl text-red-100 mb-8">
                            Encuentra respuestas a las preguntas más comunes
                        </p>

                        {/* Search */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar en preguntas frecuentes..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:ring-4 focus:ring-white/30 focus:outline-none"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {filteredFAQ.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                            <p className="text-gray-500 text-lg">
                                No se encontraron resultados para "{searchQuery}"
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredFAQ.map((category, catIdx) => (
                                <motion.div
                                    key={category.category}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: catIdx * 0.1 }}
                                >
                                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                                        {category.category}
                                    </h2>
                                    <div className="space-y-3">
                                        {category.questions.map((item, idx) => {
                                            const key = `${catIdx}-${idx}`
                                            const isOpen = openIndex === key

                                            return (
                                                <div
                                                    key={key}
                                                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            setOpenIndex(isOpen ? null : key)
                                                        }
                                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
                                                    >
                                                        <span className="font-semibold text-gray-900 pr-8">
                                                            {item.q}
                                                        </span>
                                                        <ChevronDown
                                                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-6 pb-6 text-gray-700 border-t border-gray-100 pt-4">
                                                                    {item.a}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Contact CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-8 text-center"
                    >
                        <h3 className="text-2xl font-bold mb-2">
                            ¿No encontraste lo que buscabas?
                        </h3>
                        <p className="mb-6 text-red-100">
                            Nuestro equipo está aquí para ayudarte
                        </p>
                        <a
                            href="mailto:support@red-estampacion.com"
                            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                        >
                            Contactar Soporte
                        </a>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
