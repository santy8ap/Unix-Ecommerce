'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, User, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage?: string
    author: string
    category: string
    views: number
    publishedAt: string
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        fetchPosts()
    }, [selectedCategory])

    const fetchPosts = async () => {
        try {
            const params = selectedCategory ? `?category=${selectedCategory}` : ''
            const res = await fetch(`/api/blog${params}`)
            const data = await res.json()
            setPosts(data.posts || [])
        } catch (error) {
            console.error('Error fetching blog posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const categories = ['Tendencias', 'Tutoriales', 'Noticias', 'Inspiración']

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <section className="pt-24 pb-12 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl font-black mb-4">Blog</h1>
                        <p className="text-xl text-red-100">
                            Tendencias, tutoriales e inspiración para tu estilo
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-2 rounded-full font-semibold transition ${selectedCategory === null
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full font-semibold transition ${selectedCategory === cat
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                            <p className="text-gray-500 text-lg">
                                No hay publicaciones disponibles
                            </p>
                            <p className="text-gray-400 mt-2">
                                ¡Pronto compartiremos contenido increíble!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, idx) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition group"
                                >
                                    {post.coverImage && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                                                {post.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Eye className="w-3 h-3" />
                                                {post.views}
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold mb-2 group-hover:text-red-600 transition line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <User className="w-3 h-3" />
                                                {post.author}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.publishedAt).toLocaleDateString('es-ES')}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-2 mt-4 text-red-600 hover:text-red-700 font-semibold text-sm"
                                        >
                                            Leer más
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}
