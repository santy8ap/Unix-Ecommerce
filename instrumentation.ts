/**
 * Next.js Instrumentation
 * Runs code when the server starts
 */

export async function register() {
    // Only run on server
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Import dynamically to avoid issues with client-side
        const { initCronJobs } = await import('./lib/cron/jobs')

        console.log('🚀 Starting server instrumentation...')

        // Initialize cron jobs
        try {
            initCronJobs()
            console.log('✅ Cron jobs initialized via instrumentation')
        } catch (error) {
            console.error('❌ Failed to initialize cron jobs:', error)
        }
    }
}
