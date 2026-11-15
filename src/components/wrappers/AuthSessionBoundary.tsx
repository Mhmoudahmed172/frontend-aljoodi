'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setSuspendedHandler, setUnauthorizedHandler } from '@/lib/api/token-store'

/**
 * Wires `token-store`'s 401 handler: any request through `api` or `apiProxy` that comes back
 * with a 401 clears the httpOnly session cookie (via the BFF logout route) and sends the user
 * back to `/login`. A 403 `ACCOUNT_INACTIVE` (the student was banned for tampering with the player, or
 * deactivated by an admin) does the same and lands on `/login?suspended=1`, which explains why.
 * Renders nothing — mounted once at the app root.
 */
export function AuthSessionBoundary() {
  const router = useRouter()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      fetch('/api/session/logout', { method: 'POST' })
        .catch(() => undefined)
        .finally(() => router.push('/login'))
    })

    setSuspendedHandler(() => {
      fetch('/api/session/logout', { method: 'POST' })
        .catch(() => undefined)
        .finally(() => router.push('/login?suspended=1'))
    })

    return () => {
      setUnauthorizedHandler(null)
      setSuspendedHandler(null)
    }
  }, [router])

  return null
}
