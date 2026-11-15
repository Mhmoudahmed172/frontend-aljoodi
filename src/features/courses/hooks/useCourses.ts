"use client";

import { useApiQuery } from "@/lib/api/hooks";
import { useRegion } from "@/features/region/useRegion";
import type { Paginated } from "@/types/api/common";
import type { CourseCard } from "../types/course.types";
import type { CourseFilters } from "../services/courseService";

/** Loads the public course catalog (`GET /api/v1/courses`), optionally filtered by search text. */
export function useCourses(filters?: CourseFilters) {
  const { region } = useRegion();
  const { data, isLoading, error } = useApiQuery<Paginated<CourseCard>>(["courses", "list"], "/api/v1/courses", { ...(filters as Record<string, unknown> | undefined), region });

  return {
    courses: data?.items ?? [],
    meta: data?.meta,
    loading: isLoading,
    error,
  };
}
