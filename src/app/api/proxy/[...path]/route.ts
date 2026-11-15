import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Authenticated-proxy Route Handler. The browser never holds the Passport access token (it lives
 * in an httpOnly cookie set by `src/app/api/session/login/route.ts`), so authenticated client
 * calls go through here instead of straight to Laravel: this handler reads the cookie server-side,
 * attaches `Authorization: Bearer <token>`, and forwards the request to Laravel verbatim, returning
 * its status + JSON body unchanged (so `ApiError` construction on the client still works against
 * the same `{error,message,code,data}` envelope).
 */

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'session_token'

const API_BASE = (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

/**
 * The public API address the browser uses. Laravel builds file URLs (e.g. teacher photos) from the request host, so
 * when the proxy reaches it through `API_INTERNAL_URL` the public host is forwarded in `X-Forwarded-*` — otherwise the
 * returned links would point at the internal address (e.g. `127.0.0.1:8000`) that the browser cannot reach.
 */
const PUBLIC_API_URL = (() => {
  try {
    return process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL) : null
  } catch {
    return null
  }
})()

interface RouteParams {
  params: Promise<{ path: string[] }>
}

const unauthorized = () => NextResponse.json({ error: true, message: 'يجب تسجيل الدخول', code: 'UNAUTHENTICATED', data: null }, { status: 401 })

/**
 * Forward one request to Laravel with the session token attached.
 *
 * @param request
 * @param path
 *
 * @return Promise<NextResponse>
 */
const forward = async (request: Request, path: string[]): Promise<NextResponse> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return unauthorized()
  }

  const incomingUrl = new URL(request.url)
  const targetUrl = `${API_BASE}/${path.join('/')}${incomingUrl.search}`

  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Accept', 'application/json')

  // The student's IP (nginx's `X-Forwarded-For`): Laravel trusts it from loopback only, for the video activity log and
  // rate limits, which would otherwise see every student as this server.
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) headers.set('X-Forwarded-For', forwardedFor)

  // The student's browser, not this server's `node` fetch: the video activity log reads the device from it.
  const userAgent = request.headers.get('user-agent')
  if (userAgent) headers.set('User-Agent', userAgent)

  if (PUBLIC_API_URL) {
    const proto = PUBLIC_API_URL.protocol.replace(':', '')
    headers.set('X-Forwarded-Host', PUBLIC_API_URL.hostname)
    headers.set('X-Forwarded-Proto', proto)
    headers.set('X-Forwarded-Port', PUBLIC_API_URL.port || (proto === 'https' ? '443' : '80'))
  }

  let body: BodyInit | undefined

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('multipart/form-data')) {
      // Forward the parsed FormData so `fetch` (re)computes its own multipart boundary rather
      // than reusing the original (already-consumed) boundary/body stream.
      body = await request.formData()
    } else {
      headers.set('Content-Type', contentType || 'application/json')
      body = await request.text()
    }
  }

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  })

  const payload = await upstream.text()

  return new NextResponse(payload, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
  })
}

export async function GET(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { path } = await params

  return forward(request, path)
}

export async function POST(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { path } = await params

  return forward(request, path)
}

export async function PUT(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { path } = await params

  return forward(request, path)
}

export async function PATCH(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { path } = await params

  return forward(request, path)
}

export async function DELETE(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { path } = await params

  return forward(request, path)
}
