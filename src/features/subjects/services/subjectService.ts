import { api, apiProxy } from "@/lib/api/client";
import type { Paginated } from "@/types/api/common";
import type { Subject, SubjectDetail, Unit, WatermarkTamperReason } from "../types/subject.types";

export interface SubjectFilters {
  q?: string;
  page?: number;
  per_page?: number;
}

/** `GET /api/v1/subjects` — paginated public subject catalog. */
export function getSubjects(filters?: SubjectFilters): Promise<Paginated<Subject>> {
  return api.get<Paginated<Subject>>("/api/v1/subjects", { params: filters });
}

/** `GET /api/v1/subjects/{slug}` — throws `ApiError` (404/NOT_FOUND) when the slug doesn't match an active subject. */
export function getSubject(slug: string): Promise<SubjectDetail> {
  return api.get<SubjectDetail>(`/api/v1/subjects/${slug}`);
}

/** `GET /api/v1/subjects/{slug}/units` — full curriculum outline (no pagination). */
export function getUnits(slug: string): Promise<{ items: Unit[] }> {
  return api.get<{ items: Unit[] }>(`/api/v1/subjects/${slug}/units`);
}

/** `POST /user/v1/video-activity/playhead` — how far the signed-in student's own player reached (seconds played / buffered). */
export function reportPlayhead(lesson: string, position: number, buffered: number): Promise<null> {
  return apiProxy.post<null>("/user/v1/video-activity/playhead", { lesson, position, buffered });
}

/** `POST /user/v1/video-activity/crash` — the tab crashed while the lesson player was open (sent by the next page load, never a ban). */
export function reportPlayerCrash(lesson: string, page: string | null, openSeconds: number | null): Promise<{ uuid: string }> {
  return apiProxy.post<{ uuid: string }>("/user/v1/video-activity/crash", { lesson, page, open_seconds: openSeconds });
}

/**
 * `POST /user/v1/video-activity/tamper` — tells the server the player found the watermark tampered with (signed-in
 * students). `banned` is false when the evidence was weak and the case waits for an admin.
 */
export function reportWatermarkTamper(lesson: string, reason: WatermarkTamperReason, details?: Record<string, unknown>): Promise<{ uuid: string; banned?: boolean }> {
  return apiProxy.post<{ uuid: string; banned?: boolean }>("/user/v1/video-activity/tamper", { lesson, reason, details });
}
