import { api } from "@/lib/api/client";
import type { Paginated } from "@/types/api/common";
import type { Teacher, TeacherDetail } from "../types/teacher.types";

export interface TeacherFilters {
  q?: string;
  subject?: string;
  page?: number;
  per_page?: number;
}

/** `GET /api/v1/teachers` — paginated public teacher catalog, optionally filtered by `subject` uuid or `q` search text. */
export function getTeachers(filters?: TeacherFilters): Promise<Paginated<Teacher>> {
  return api.get<Paginated<Teacher>>("/api/v1/teachers", { params: filters });
}

/** `GET /api/v1/teachers/{uuid}` — throws `ApiError` (404/NOT_FOUND) when the uuid doesn't match a visible teacher. */
export function getTeacher(uuid: string): Promise<TeacherDetail> {
  return api.get<TeacherDetail>(`/api/v1/teachers/${uuid}`);
}
