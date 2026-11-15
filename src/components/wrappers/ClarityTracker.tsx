'use client'
import { useEffect } from 'react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useSessionStatus } from '@/features/auth/hooks/useSessionStatus'
import { clarityEnabled, clarityIdentify, loadClarity } from '@/lib/clarity'

/**
 * Loads Microsoft Clarity (when configured) and ties the recording to the signed-in student's account uuid. Guests are
 * recorded without an id. Renders nothing — mounted once at the app root.
 */
export function ClarityTracker() {
  const { data: session } = useSessionStatus()
  const signedIn = clarityEnabled() && session?.authenticated === true
  const { data: user } = useCurrentUser(signedIn)

  useEffect(() => {
    loadClarity()
  }, [])

  useEffect(() => {
    if (signedIn && user?.uuid) clarityIdentify(user.uuid)
  }, [signedIn, user?.uuid])

  return null
}
