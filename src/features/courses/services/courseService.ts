import { api } from "@/lib/api/client";
import type { Paginated } from "@/types/api/common";
import type { CourseCard } from "../types/course.types";

export interface CourseFilters {
  q?: string;
  page?: number;
  per_page?: number;
  /** Shuffles the list; the same seed keeps one order across pages, so pages never repeat a course. */
  seed?: number;
}

/** `GET /api/v1/courses` — paginated public course catalog (subject, primary teacher, branch, prices). */
export function getCourses(filters?: CourseFilters): Promise<Paginated<CourseCard>> {
  return api.get<Paginated<CourseCard>>("/api/v1/courses", { params: filters });
}
