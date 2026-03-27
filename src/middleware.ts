import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_TOKEN = 'admin_authenticated'

export function middleware(request: NextRequest) {
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = request.nextUrl.pathname === '/admin/login'
    const isResetPage = request.nextUrl.pathname === '/admin/reset-password'

    if (isAdminPath && !isLoginPage && !isResetPage) {
        const authCookie = request.cookies.get('admin_auth')
        if (!authCookie || authCookie.value !== SESSION_TOKEN) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    if (isLoginPage) {
        const authCookie = request.cookies.get('admin_auth')
        if (authCookie && authCookie.value === SESSION_TOKEN) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
