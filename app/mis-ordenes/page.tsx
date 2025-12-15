"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'
import Badge from '@/components/Badge'
import Alert from '@/components/Alert'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, ChevronDown, Calendar, DollarSign, Truck, CheckCircle, Clock, ArrowRight } from 'lucide-react'

type OrderItem = { id: string; productId: string; quantity: number; price: number; size?: string; color?: string }
type Order = { id: string; createdAt: string; total: number; items: OrderItem[]; status?: string; shippingAddress?: string }

const ORDER_STATUSES = {
  pending: { label: 'Pendiente', color: 'warning', icon: Clock },
  processing: { label: 'Procesando', color: 'info', icon: Clock },
  shipped: { label: 'Enviado', color: 'info', icon: Truck },
  delivered: { label: 'Entregado', color: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'error', icon: Package },
}

export default function MyOrdersPage() {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/api/auth/signin')
      return
    }
    if (sessionStatus === 'authenticated') {
      fetchOrders()
    }
  }, [sessionStatus, router])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('Error al cargar órdenes')
      const data = await res.json()

      let sortedOrders = Array.isArray(data) ? data : []

      // Aplicar ordenamiento
      switch (sortBy) {
        case 'oldest':
          sortedOrders = sortedOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'highest':
          sortedOrders = sortedOrders.sort((a, b) => b.total - a.total)
          break
        case 'lowest':
          sortedOrders = sortedOrders.sort((a, b) => a.total - b.total)
          break
        case 'newest':
        default:
          sortedOrders = sortedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setOrders(sortedOrders)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOrderStatus = (order: Order) => {
    const status = order.status || 'pending'
    return ORDER_STATUSES[status as keyof typeof ORDER_STATUSES] || ORDER_STATUSES.pending
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)

  if (loading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <Loading />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl"
              >
                <Package className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Mis Órdenes</h1>
                <p className="text-red-200 text-lg font-medium">Historial y estado de tus compras</p>
              </div>
            </div>

            {orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
              >
                <p className="text-red-200 text-sm font-medium uppercase tracking-wider mb-1">Total gastado</p>
                <p className="text-4xl font-black text-white">${totalSpent.toFixed(2)}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (
          <motion.div className="mb-6">
            <Alert
              variant="error"
              title="Error"
              description={error}
              closable
            />
          </motion.div>
        )}

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Sin órdenes aún"
            description="No has realizado ninguna compra. ¡Explora nuestros productos y haz tu primer pedido!"
            actionLabel="Explorar Productos"
            actionHref="/productos"
          />
        ) : (
          <div className="space-y-6">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center justify-between flex-wrap gap-4"
            >
              <div>
                <p className="text-gray-700 font-semibold">
                  Total de órdenes: <span className="text-red-600 text-lg">{orders.length}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 cursor-pointer hover:bg-gray-50 transition"
                >
                  <option value="newest">Más Recientes</option>
                  <option value="oldest">Más Antiguas</option>
                  <option value="highest">Mayor Monto</option>
                  <option value="lowest">Menor Monto</option>
                </select>
              </div>
            </motion.div>

            {/* Orders List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {orders.map((order, idx) => {
                  const statusInfo = getOrderStatus(order)
                  const isExpanded = expandedOrderId === order.id

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden"
                    >
                      {/* Order Header */}
                      <motion.button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition text-left"
                      >
                        <div className="flex items-center gap-6 flex-1">
                          {/* Order Number & Date */}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Orden #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <Badge
                            label={statusInfo.label}
                            variant={statusInfo.color as any}
                            size="md"
                            icon={<statusInfo.icon className="w-4 h-4" />}
                          />

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-gray-600 text-sm">Total</p>
                            <p className="text-2xl font-bold text-red-600">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        </motion.div>
                      </motion.button>

                      {/* Order Details (Expandible) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200 bg-gray-50"
                          >
                            <div className="p-6 space-y-6">
                              {/* Items List */}
                              <div>
                                <h4 className="font-bold text-gray-900 mb-4">Productos</h4>
                                <div className="space-y-3">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                                      <div>
                                        <p className="font-semibold text-gray-900">
                                          Producto ID: {item.productId.slice(-6)}
                                        </p>
                                        <div className="flex gap-3 text-sm text-gray-600 mt-1">
                                          {item.size && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Talla: {item.size}</span>}
                                          {item.color && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Color: {item.color}</span>}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                        <p className="font-bold text-red-600">${(item.price * item.quantity).toFixed(2)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping Info */}
                              {order.shippingAddress && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Dirección de Envío
                                  </h4>
                                  <p className="text-gray-700">{order.shippingAddress}</p>
                                </div>
                              )}

                              {/* Order Summary */}
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-600 text-sm">Subtotal</p>
                                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 text-sm">Estado</p>
                                    <Badge
                                      label={statusInfo.label}
                                      variant={statusInfo.color as any}
                                      size="sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => router.push(`/productos?orderId=${order.id}`)}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                  Ver Productos
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => window.print()}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                                >
                                  Descargar
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}