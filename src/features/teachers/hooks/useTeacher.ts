"use client";

import { api, apiProxy } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import { useRegion } from "@/features/region/useRegion";
import { useSessionStatus } from "@/features/auth/hooks/useSessionStatus";
import type { TeacherDetail } from "../types/teacher.types";

/**
 * `GET /api/v1/teachers/{uuid}` — throws a 404 `ApiError` (surfaced as `error`) when the uuid doesn't resolve. A
 * signed-in student goes through the authenticated proxy so the teacher carries the student's subscription fields.
 */
export function useTeacher(uuid: string) {
  const { region } = useRegion();
  const { data: session, isLoading: sessionLoading } = useSessionStatus();
  const authenticated = session?.authenticated === true;
  const { data, isLoading, error } = useApiQuery<TeacherDetail>(
    ["teachers", "detail", uuid, authenticated],
    `/api/v1/teachers/${uuid}`,
    { region },
    { enabled: Boolean(uuid) && !sessionLoading, retry: false },
    authenticated ? apiProxy : api,
  );

  return { teacher: data, loading: isLoading || sessionLoading, error };
}
