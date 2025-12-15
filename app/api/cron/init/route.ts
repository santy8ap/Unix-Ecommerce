/**
 * Cron Jobs Initialization Route
 * Initialize all cron jobs when the app starts
 */

import { NextResponse } from 'next/server'
import { initCronJobs } from '@/lib/cron/jobs'

// This will be called automatically by Next.js instrumentation
// or can be called manually via API
export async function GET() {
    try {
        initCronJobs()

        return NextResponse.json({
            success: true,
            message: 'Cron jobs initialized successfully',
        })
    } catch (error: any) {
        console.error('Error initializing cron jobs:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to initialize cron jobs',
            },
            { status: 500 }
        )
    }
}
