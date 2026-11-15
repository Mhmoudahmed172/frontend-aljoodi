import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * BFF session-login handler. The client obtains `{access_token, expires_at, user}` directly
 * from Laravel first (via the public `api` instance — either `POST /auth/login` or an OTP-verify
 * auto-login response), then posts that payload here so the access token can be persisted in an
 * httpOnly cookie. The token is never echoed back in the response body.
 *
 * `remember: false` (login form with "remember me" unticked) sets a browser-session cookie (no
 * `maxAge`/`expires`), so the session ends when the browser is closed. Omitted/`true` keeps the
 * cookie until the token's `expires_at`.
 */

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'session_token'

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

interface SessionLoginBody {
  access_token?: string
  expires_at?: string
  remember?: boolean
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: SessionLoginBody

  try {
    body = (await request.json()) as SessionLoginBody
  } catch {
    return NextResponse.json({ error: true, message: 'طلب غير صالح' }, { status: 400 })
  }

  const accessToken = body.access_token

  if (!accessToken) {
    return NextResponse.json({ error: true, message: 'رمز الدخول مفقود' }, { status: 400 })
  }

  const remember = body.remember !== false
  const expiresAt = body.expires_at ? new Date(body.expires_at).getTime() : null
  const maxAge = expiresAt ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)) : DEFAULT_MAX_AGE_SECONDS

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(remember ? { maxAge } : {}),
  })

  return NextResponse.json({ ok: true })
}
