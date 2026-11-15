"use client";

import { api, apiProxy } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import { useSessionStatus } from "@/features/auth/hooks/useSessionStatus";
import type { Paginated } from "@/types/api/common";
import type { Teacher } from "../types/teacher.types";
import type { TeacherFilters } from "../services/teacherService";

/**
 * Loads the teacher catalog (`GET /api/v1/teachers`), optionally filtered by `subject` uuid or search text. A signed-in
 * student goes through the authenticated proxy so each teacher carries `subscribed`, `subscription_status` and
 * `progress`; guests hit the public endpoint directly.
 */
export function useTeachers(filters?: TeacherFilters) {
  const { data: session, isLoading: sessionLoading } = useSessionStatus();
  const authenticated = session?.authenticated === true;
  const { data, isLoading, error } = useApiQuery<Paginated<Teacher>>(
    ["teachers", "list", authenticated],
    "/api/v1/teachers",
    filters as Record<string, unknown> | undefined,
    { enabled: !sessionLoading },
    authenticated ? apiProxy : api,
  );

  return {
    teachers: data?.items ?? [],
    meta: data?.meta,
    loading: isLoading || sessionLoading,
    error,
  };
}
