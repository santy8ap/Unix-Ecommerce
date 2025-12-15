/**
 * NextAuth Diagnostics
 * Verifica la configuración de NextAuth y variables de entorno
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        checks: {} as Record<string, { status: string; message: string }>,
    }

    // Check NEXTAUTH_SECRET
    if (process.env.NEXTAUTH_SECRET) {
        diagnostics.checks.NEXTAUTH_SECRET = {
            status: 'OK',
            message: 'Secret is configured',
        }
    } else {
        diagnostics.checks.NEXTAUTH_SECRET = {
            status: 'ERROR',
            message: 'NEXTAUTH_SECRET is missing',
        }
    }

    // Check NEXTAUTH_URL
    if (process.env.NEXTAUTH_URL) {
        diagnostics.checks.NEXTAUTH_URL = {
            status: 'OK',
            message: `Set to: ${process.env.NEXTAUTH_URL}`,
        }
    } else {
        diagnostics.checks.NEXTAUTH_URL = {
            status: 'WARNING',
            message: 'NEXTAUTH_URL is not set (optional but recommended)',
        }
    }

    // Check Google OAuth
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        diagnostics.checks.GOOGLE_OAUTH = {
            status: 'OK',
            message: 'Google OAuth credentials configured',
        }
    } else {
        diagnostics.checks.GOOGLE_OAUTH = {
            status: 'WARNING',
            message: 'Google OAuth not configured',
        }
    }

    // Check Database Connection
    try {
        await prisma.$connect()
        await prisma.$disconnect()
        diagnostics.checks.DATABASE = {
            status: 'OK',
            message: 'Database connection successful',
        }
    } catch (error) {
        diagnostics.checks.DATABASE = {
            status: 'ERROR',
            message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }
    }

    // Check if User table exists
    try {
        await prisma.user.findFirst()
        diagnostics.checks.USER_TABLE = {
            status: 'OK',
            message: 'User table accessible',
        }
    } catch (error) {
        diagnostics.checks.USER_TABLE = {
            status: 'ERROR',
            message: `User table error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }
    }

    // Summary
    const errorCount = Object.values(diagnostics.checks).filter(
        (c) => c.status === 'ERROR'
    ).length
    const warningCount = Object.values(diagnostics.checks).filter(
        (c) => c.status === 'WARNING'
    ).length

    return NextResponse.json({
        ...diagnostics,
        summary: {
            total: Object.keys(diagnostics.checks).length,
            errors: errorCount,
            warnings: warningCount,
            healthy: errorCount === 0,
        },
    })
}
