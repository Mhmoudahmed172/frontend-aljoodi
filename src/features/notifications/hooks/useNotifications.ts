"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiProxy, type ApiError } from "@/lib/api";
import { useApiMutation, useApiQuery } from "@/lib/api/hooks";
import type { AppNotification, NotificationsPage } from "../types/notification.types";

const KEY = ["notifications", "list"];
const POLL_MS = 60_000;
const PER_PAGE = 20;

/** `GET /user/v1/notifications` (first page) — newest first with the unread count; refreshed every minute while the page is open. */
export function useNotifications(enabled = true) {
  const { data, isLoading, error } = useApiQuery<NotificationsPage>(KEY, "/user/v1/notifications", { per_page: PER_PAGE }, { enabled, refetchInterval: POLL_MS, refetchOnWindowFocus: true }, apiProxy);

  return { notifications: data?.items ?? [], unreadCount: data?.unread_count ?? 0, loading: isLoading, error };
}

/**
 * Paged `GET /user/v1/notifications?page=N` for the notifications popover's "load more". Lives under the same key prefix, so
 * mark-read / mark-all invalidations refresh it too; it keeps the same 60 s polling (re-fetching the loaded pages) while mounted.
 * Items are de-duplicated by id because a notification arriving between page loads shifts the pages by one.
 */
export function useNotificationsFeed(enabled = true) {
  const query = useInfiniteQuery<NotificationsPage, ApiError>({
    queryKey: [...KEY, "feed"],
    queryFn: ({ pageParam, signal }) => apiProxy.get<NotificationsPage>("/user/v1/notifications", { params: { per_page: PER_PAGE, page: pageParam }, signal }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined),
    enabled,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  });

  const seen = new Set<string>();
  const notifications = (query.data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);

      return true;
    });

  return {
    notifications,
    loading: query.isLoading,
    error: query.error,
    hasMore: query.hasNextPage,
    loadingMore: query.isFetchingNextPage,
    loadMore: () => void query.fetchNextPage(),
  };
}

/** `POST /user/v1/notifications/{id}/read`. */
export function useMarkNotificationRead() {
  return useApiMutation<string, AppNotification>((id) => apiProxy.post<AppNotification>(`/user/v1/notifications/${id}/read`), {
    invalidate: [KEY],
    successMessage: false,
    errorMessage: false,
  });
}

/** `POST /user/v1/notifications/read-all`. */
export function useMarkAllNotificationsRead() {
  return useApiMutation<void, { unread_count: number }>(() => apiProxy.post<{ unread_count: number }>("/user/v1/notifications/read-all"), {
    invalidate: [KEY],
    successMessage: false,
  });
}
