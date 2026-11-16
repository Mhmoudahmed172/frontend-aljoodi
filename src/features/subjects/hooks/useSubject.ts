'use client'

import { api, apiProxy } from '@/lib/api'
import { useApiQuery } from '@/lib/api/hooks'
import { useRegion } from '@/features/region/useRegion'
import { useSessionStatus } from '@/features/auth/hooks/useSessionStatus'
import { LOCAL_PREVIEW, isDemoId } from '@/lib/preview/catalog'
import type { SubjectDetail, Unit } from '../types/subject.types'

/** `GET /api/v1/subjects/{slug}` — throws a 404 `ApiError` (surfaced as `error`) when the slug doesn't resolve. */
export function useSubject(slug: string) {
  const { region } = useRegion()
  const { data, isLoading, error } = useApiQuery<SubjectDetail>(
    ['subjects', 'detail', slug],
    `/api/v1/subjects/${slug}`,
    { region },
    {
      enabled: Boolean(slug),
      retry: false,
    },
  )

  return { subject: data, loading: isLoading, error }
}

/**
 * `GET /api/v1/subjects/{slug}/units?course=` — the curriculum outline of one of the subject's courses (the first one when
 * `course` is omitted) shown in the units accordion. A signed-in student
 * goes through the authenticated proxy so per-student fields (`is_unlocked`, `quiz.attempt_status`,
 * `locked_by_quiz`) are filled in; guests hit the public endpoint directly.
 */
export function useUnits(slug: string, course?: string | null) {
  const demo = LOCAL_PREVIEW && isDemoId(slug)
  const { data: session, isLoading: sessionLoading } = useSessionStatus()
  const authenticated = session?.authenticated === true
  const { data, isLoading, error } = useApiQuery<{ items: Unit[] }>(
    ['subjects', 'units', slug, authenticated],
    `/api/v1/subjects/${slug}/units`,
    { course },
    { enabled: Boolean(slug) && (demo || !sessionLoading), retry: false },
    authenticated && !demo ? apiProxy : api,
  )

  return { units: data?.items ?? [], loading: isLoading || (!demo && sessionLoading), error }
}
