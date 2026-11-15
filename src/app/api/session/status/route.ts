import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * BFF session-status handler. Reports whether the httpOnly session cookie is present so public
 * pages can decide between the guest and signed-in header without calling `/auth/me` (which
 * would answer 401 for guests and trip the global sign-out redirect in `AuthSessionBoundary`).
 * Never echoes the token itself.
 */

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'session_token'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies()

  return NextResponse.json({ authenticated: cookieStore.has(SESSION_COOKIE_NAME) })
}
