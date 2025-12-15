'use client'

import { motion } from 'framer-motion'

export function ProductCardSkeleton() {
    return (
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 h-full flex flex-col">
            {/* Image skeleton */}
            <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-700 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
                {/* Category */}
                <div className="h-3 bg-slate-800 rounded w-20 animate-pulse" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 bg-slate-700 rounded w-full animate-pulse" />
                    <div className="h-5 bg-slate-700 rounded w-3/4 animate-pulse" />
                </div>

                {/* Price */}
                <div className="h-8 bg-slate-800 rounded w-32 animate-pulse" />

                {/* Button */}
                <div className="h-12 bg-slate-800 rounded-lg w-full animate-pulse mt-auto" />
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image skeleton */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl animate-pulse" />
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-slate-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Info skeleton */}
                <div className="space-y-6">
                    <div className="h-10 bg-slate-700 rounded w-3/4 animate-pulse" />
                    <div className="h-12 bg-slate-800 rounded w-32 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
                        <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
                        <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse" />
                    </div>
                    <div className="h-16 bg-slate-800 rounded-lg w-full animate-pulse" />
                </div>
            </div>
        </div>
    )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800">
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {Array.from({ length: cols }).map((_, i) => (
                        <div key={i} className="h-5 bg-slate-700 rounded animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-800">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="p-4">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <div key={colIndex} className="h-4 bg-slate-800 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="bg-slate-900 rounded-xl shadow-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-slate-800 rounded w-24 animate-pulse" />
                <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse" />
            </div>
            <div className="h-8 bg-slate-700 rounded w-32 animate-pulse mb-2" />
            <div className="h-3 bg-slate-800 rounded w-20 animate-pulse" />
        </div>
    )
}
