/**
 * Environment Variables Validation
 * Validates required environment variables at startup
 */

const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
] as const

const optionalEnvVars = {
    // Authentication
    'GOOGLE_CLIENT_ID': 'Google OAuth',
    'GOOGLE_CLIENT_SECRET': 'Google OAuth',

    // Email
    'SMTP_USER': 'Email service',
    'SMTP_PASS': 'Email service',

    // Cloudinary
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': 'Image uploads',
    'CLOUDINARY_API_KEY': 'Image uploads',
    'CLOUDINARY_API_SECRET': 'Image uploads',

    // Payments (at least one should be configured)
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID': 'PayPal payments',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'Stripe payments',
    'NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY': 'Crypto payments',
} as const

export function validateEnv() {
    const errors: string[] = []
    const warnings: string[] = []

    // Check required variables
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            errors.push(`❌ Missing required environment variable: ${envVar}`)
        }
    })

    // Check optional but recommended variables
    Object.entries(optionalEnvVars).forEach(([envVar, description]) => {
        if (!process.env[envVar]) {
            warnings.push(`⚠️  Optional variable missing: ${envVar} (needed for ${description})`)
        }
    })

    // Check if at least one payment method is configured
    const hasPayment =
        !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
        !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        !!process.env.NEXT_PUBLIC_COINBASE_COMMERCE_API_KEY

    if (!hasPayment) {
        warnings.push('⚠️  No payment gateway configured. Add at least one payment method.')
    }

    // Log results
    if (errors.length > 0) {
        console.error('\n🚨 Environment Validation Failed:\n')
        errors.forEach(error => console.error(error))
        console.error('\nApplication may not function correctly without these variables.\n')

        if (process.env.NODE_ENV === 'production') {
            throw new Error('Missing required environment variables in production')
        }
    }

    if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
        console.warn('\n⚠️  Environment Warnings:\n')
        warnings.forEach(warning => console.warn(warning))
        console.warn('\nSome features may not be available.\n')
    }

    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ Environment validation passed')
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    }
}

/**
 * Get environment variable safely with type checking
 */
export function getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key]

    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${key} is not defined`)
    }

    return value || defaultValue || ''
}

/**
 * Get environment variable as number
 */
export function getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key]

    if (!value) {
        if (defaultValue !== undefined) return defaultValue
        throw new Error(`Environment variable ${key} is not defined`)
    }

    const num = parseInt(value, 10)
    if (isNaN(num)) {
        throw new Error(`Environment variable ${key} must be a number`)
    }

    return num
}

/**
 * Get environment variable as boolean
 */
export function getEnvBoolean(key: string, defaultValue = false): boolean {
    const value = process.env[key]

    if (!value) return defaultValue

    return value === 'true' || value === '1'
}

// Run validation on import (only in Node.js environment)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
    validateEnv()
}
