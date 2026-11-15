import type { PaginationMeta } from "@/types/api/common";

/** `data.kind` of a `StudentNotification` (backend `NotificationService`). */
export type NotificationKind = "subscription_received" | "subscription_activated" | "subscription_cancelled" | "lesson_published";

/** `NotificationResource` — `GET /user/v1/notifications` item. */
export interface AppNotification {
  id: string;
  kind: NotificationKind | string | null;
  title: string;
  body: string;
  /** Website path to open (e.g. `/dashboard/subjects/{slug}`). */
  url: string | null;
  meta: Record<string, unknown>;
  read_at: string | null;
  created_at: string | null;
}

export interface NotificationsPage {
  items: AppNotification[];
  unread_count: number;
  meta: PaginationMeta;
}
