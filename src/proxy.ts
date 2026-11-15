import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Route protection (Next 16 renamed `middleware.ts` -> `proxy.ts`; `middleware` is deprecated,
 * see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).
 *
 * Reads the httpOnly session cookie (never readable from client JS) and:
 * - redirects unauthenticated visitors away from `/dashboard/*` to `/login`.
 * - redirects unauthenticated visitors away from `/profile` (the current user's own account page,
 *   despite living outside the `/dashboard` route group) to `/login`.
 * - redirects already-authenticated visitors away from the `(auth)` route group to `/dashboard`.
 */

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'session_token'

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp']

const PROTECTED_PATHS = ['/dashboard', '/profile']

const isAuthPath = (pathname: string): boolean => AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

const isProtectedPath = (pathname: string): boolean => PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME)

  if (isProtectedPath(pathname) && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''

    return NextResponse.redirect(url)
  }

  if (isAuthPath(pathname) && hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile', '/profile/:path*', '/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'],
}
