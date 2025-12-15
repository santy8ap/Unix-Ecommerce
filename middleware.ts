/**
 * Next.js Middleware
 * Protección de rutas y redirecciones
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get the session token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    // Protected routes that require authentication
    const protectedRoutes: string[] = [
        '/closet',
        '/outfits',
        '/mis-ordenes',
        '/perfil',
        '/checkout',
    ]

    // Admin-only routes
    const adminRoutes = ['/admin']

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isAdminRoute = adminRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Redirect to signin if trying to access protected route without auth
    if (isProtectedRoute && !token) {
        const url = new URL('/auth/signin', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }

    // Redirect to home if trying to access admin without admin role
    if (isAdminRoute && (!token || token.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirect authenticated users away from auth pages
    if (token && pathname.startsWith('/auth/signin')) {
        const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/'
        return NextResponse.redirect(new URL(callbackUrl, request.url))
    }

    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
    ],
}
