import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/** Clears the httpOnly session cookie. */

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'session_token'

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)

  return NextResponse.json({ ok: true })
}
