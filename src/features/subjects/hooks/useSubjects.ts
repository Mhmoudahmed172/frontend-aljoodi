"use client";

import { useApiQuery } from "@/lib/api/hooks";
import type { Paginated } from "@/types/api/common";
import type { Subject } from "../types/subject.types";
import type { SubjectFilters } from "../services/subjectService";

/**
 * Loads the public subject catalog (`GET /api/v1/subjects`), optionally filtered by search text.
 * The public catalog has no per-student `status`/`progress` — that's a future "my subjects" endpoint.
 */
export function useSubjects(filters?: SubjectFilters) {
  const { data, isLoading, error } = useApiQuery<Paginated<Subject>>(["subjects", "list"], "/api/v1/subjects", filters as Record<string, unknown> | undefined);

  return {
    subjects: data?.items ?? [],
    meta: data?.meta,
    loading: isLoading,
    error,
  };
}
