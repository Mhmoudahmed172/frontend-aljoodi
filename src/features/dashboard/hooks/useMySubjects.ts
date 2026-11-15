"use client";

import { apiProxy } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import type { Paginated } from "@/types/api/common";
import type { MySubject } from "../types/dashboard.types";
import type { CourseFile } from "@/features/subjects/types/subject.types";

export interface MySubjectFilters {
  q?: string;
  page?: number;
  per_page?: number;
}

/**
 * `GET /user/v1/subjects` — the signed-in student's own subscribed subjects (with `progress` and
 * `subscription_status`), NOT the public catalog. See `@/features/subjects/hooks/useSubjects` for
 * the public, unauthenticated equivalent used outside the dashboard.
 */
export function useMySubjects(filters?: MySubjectFilters) {
  const { data, isLoading, error } = useApiQuery<Paginated<MySubject>>(
    ["dashboard", "my-subjects", "list"],
    "/user/v1/subjects",
    filters as Record<string, unknown> | undefined,
    undefined,
    apiProxy,
  );

  return {
    subjects: data?.items ?? [],
    meta: data?.meta,
    loading: isLoading,
    error,
  };
}

/** `GET /user/v1/subjects/{uuid}` — 404s (surfaced as `error`) when the student isn't subscribed. */
export function useMySubject(identifier: string) {
  const { data, isLoading, error } = useApiQuery<MySubject>(
    ["dashboard", "my-subjects", "detail", identifier],
    `/user/v1/subjects/${identifier}`,
    undefined,
    { enabled: Boolean(identifier), retry: false },
    apiProxy,
  );

  return { subject: data, loading: isLoading, error };
}

/** `GET /user/v1/subjects/{uuid}/files` — course materials; empty unless the student holds an active subscription. */
export function useMyCourseFiles(identifier: string) {
  const { data, isLoading, error } = useApiQuery<{ items: CourseFile[] }>(
    ["dashboard", "my-subjects", "files", identifier],
    `/user/v1/subjects/${identifier}/files`,
    undefined,
    { enabled: Boolean(identifier), retry: false },
    apiProxy,
  );

  return { files: data?.items ?? [], loading: isLoading, error };
}

