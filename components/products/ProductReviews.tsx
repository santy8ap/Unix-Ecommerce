'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, CheckCircle, Upload, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
    id: string
    userId: string
    userName: string
    userImage?: string
    rating: number
    title: string
    comment: string
    images?: string[]
    verifiedPurchase: boolean
    helpfulCount: number
    createdAt: string
    userHelpful?: boolean
}

interface ProductReviewsProps {
    productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const { data: session } = useSession()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [sortBy, setSortBy] = useState('recent')
    const [filterRating, setFilterRating] = useState<number | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: '',
        images: [] as string[],
    })
    const [submitting, setSubmitting] = useState(false)

    // Stats
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    })

    useEffect(() => {
        fetchReviews()
    }, [productId, sortBy, filterRating])

    const fetchReviews = async () => {
        try {
            const params = new URLSearchParams({
                sortBy,
                ...(filterRating && { rating: filterRating.toString() }),
            })
            const res = await fetch(`/api/reviews/${productId}?${params}`)
            const data = await res.json()
            setReviews(data.reviews || [])
            setStats(data.stats || stats)
        } catch (error) {
            console.error('Error fetching reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) {
            toast.error('Debes iniciar sesión para dejar una reseña')
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch(`/api/reviews/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Error al enviar la reseña')

            toast.success('¡Reseña publicada con éxito!')
            setShowForm(false)
            setFormData({ rating: 5, title: '', comment: '', images: [] })
            fetchReviews()
        } catch (error) {
            toast.error('Error al publicar la reseña')
        } finally {
            setSubmitting(false)
        }
    }

    const handleHelpful = async (reviewId: string) => {
        if (!session) {
            toast.error('Debes iniciar sesión')
            return
        }

        try {
            await fetch(`/api/reviews/${productId}/${reviewId}/helpful`, {
                method: 'POST',
            })
            fetchReviews()
        } catch (error) {
            toast.error('Error al votar')
        }
    }

    const StarRating = ({ rating, size = 5, interactive = false, onChange }: any) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && onChange?.(star)}
                    className={interactive ? 'cursor-pointer' : ''}
                >
                    <Star
                        className={`w-${size} h-${size} ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            } transition`}
                    />
                </button>
            ))}
        </div>
    )

    return (
        <div className="space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="text-3xl font-bold mb-6">
                    Opiniones de Clientes
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Average Rating */}
                    <div className="text-center">
                        <div className="text-6xl font-black text-gray-900 mb-2">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <StarRating rating={Math.round(stats.averageRating)} />
                        <p className="text-gray-600 mt-2">
                            {stats.totalReviews} reseñas
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = stats.distribution[stars as keyof typeof stats.distribution] || 0
                            const percentage = stats.totalReviews > 0
                                ? (count / stats.totalReviews) * 100
                                : 0

                            return (
                                <button
                                    key={stars}
                                    onClick={() => setFilterRating(stars)}
                                    className="flex items-center gap-2 w-full hover:bg-gray-50 p-1 rounded transition"
                                >
                                    <span className="text-sm font-medium w-12">
                                        {stars} <Star className="w-3 h-3 inline fill-yellow-400 text-yellow-400" />
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-12">
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Write Review Button */}
                {session && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        {showForm ? 'Cancelar' : 'Escribir una Reseña'}
                    </button>
                )}
            </div>

            {/* Review Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-2xl p-8 border border-gray-200"
                    >
                        <h3 className="text-2xl font-bold mb-6">
                            Tu Opinión
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Calificación *
                                </label>
                                <StarRating
                                    rating={formData.rating}
                                    size={8}
                                    interactive
                                    onChange={(rating: number) =>
                                        setFormData({ ...formData, rating })
                                    }
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Resume tu experiencia"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Comentario *
                                </label>
                                <textarea
                                    required
                                    value={formData.comment}
                                    onChange={(e) =>
                                        setFormData({ ...formData, comment: e.target.value })
                                    }
                                    rows={5}
                                    placeholder="Comparte tu opinión sobre el producto..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
                            >
                                {submitting ? 'Publicando...' : 'Publicar Reseña'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                    <option value="recent">Más Recientes</option>
                    <option value="helpful">Más Útiles</option>
                    <option value="rating-high">Mayor Calificación</option>
                    <option value="rating-low">Menor Calificación</option>
                </select>

                {filterRating && (
                    <button
                        onClick={() => setFilterRating(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2"
                    >
                        {filterRating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                        <p className="text-gray-500">
                            No hay reseñas aún. ¡Sé el primero en opinar!
                        </p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 border border-gray-200"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {review.userImage ? (
                                        <img
                                            src={review.userImage}
                                            alt={review.userName}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-600 font-bold">
                                                {review.userName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">
                                                {review.userName}
                                            </p>
                                            {review.verifiedPurchase && (
                                                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Compra Verificada
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>

                            {/* Content */}
                            <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                            <p className="text-gray-700 mb-4">{review.comment}</p>

                            {/* Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                    {review.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Review image ${idx + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Helpful */}
                            <button
                                onClick={() => handleHelpful(review.id)}
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
                            >
                                <ThumbsUp className="w-4 h-4" />
                                Útil ({review.helpfulCount})
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
