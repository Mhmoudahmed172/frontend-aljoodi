"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format";
import { BellIcon, BookOpenIcon, CheckCircleIcon, CloseIcon, FileCheckIcon } from "@/components/ui/Icons";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useNotificationsFeed } from "@/features/notifications/hooks/useNotifications";
import type { AppNotification } from "@/features/notifications/types/notification.types";

interface NotificationsPopoverProps {
  onClose: () => void;
}

/** Icon + tint per notification kind. */
function kindIcon(kind: AppNotification["kind"]) {
  switch (kind) {
    case "subscription_activated":
      return { icon: <CheckCircleIcon size={18} />, tone: "bg-success-soft text-success" };
    case "subscription_cancelled":
      return { icon: <CloseIcon size={18} />, tone: "bg-danger-soft text-danger" };
    case "lesson_published":
      return { icon: <BookOpenIcon size={18} />, tone: "bg-accent-soft text-warning" };
    case "subscription_received":
      return { icon: <FileCheckIcon size={18} />, tone: "bg-primary-subtle text-primary" };
    default:
      return { icon: <BellIcon size={18} />, tone: "bg-primary-subtle text-primary" };
  }
}

/**
 * Real notifications list (`GET /user/v1/notifications`, paged with "load more"): tap marks as read and opens the linked page;
 * "mark all read" at the top. The unread count comes from the polled first-page query shared with the bell badge.
 */
export function NotificationsPopover({ onClose }: NotificationsPopoverProps) {
  const { t } = useT();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { notifications, loading, hasMore, loadingMore, loadMore } = useNotificationsFeed();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const open = (n: AppNotification) => {
    if (!n.read_at) markRead.mutate(n.id);
    onClose();
    if (n.url) router.push(n.url);
  };

  return (
    <div className="absolute end-0 top-14 z-40 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-base font-bold text-text-heading">{t("dashboard.notifications")}</h3>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button type="button" onClick={() => markAll.mutate()} disabled={markAll.isPending} className="text-[11px] font-semibold text-primary hover:underline">
              {t("dashboard.markAllRead")}
            </button>
          )}
          <button type="button" onClick={onClose} className="text-text-muted" aria-label={t("common.close")}>
            <CloseIcon size={18} />
          </button>
        </div>
      </div>
      {loading ? (
        <ul className="px-5 py-4">
          {[0, 1, 2].map((i) => (
            <li key={i} className="mb-3 h-12 animate-pulse rounded-xl bg-surface" />
          ))}
        </ul>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <BellIcon size={22} />
          </span>
          <p className="text-sm font-bold text-text-heading">{t("dashboard.noNotifications")}</p>
          <p className="text-xs text-text-muted">{t("dashboard.noNotificationsText")}</p>
        </div>
      ) : (
        <ul className="max-h-96 overflow-y-auto">
          {notifications.map((n) => {
            const { icon, tone } = kindIcon(n.kind);
            return (
              <li key={n.id}>
                <button type="button" onClick={() => open(n)} className={cn("flex w-full gap-3 px-5 py-4 text-start transition hover:bg-surface", !n.read_at && "bg-primary-faint")}>
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tone)}>{icon}</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className={cn("text-xs leading-5 text-text-heading", !n.read_at && "font-bold")}>{n.title}</span>
                    <span className="text-[11px] leading-5 text-text-muted">{n.body}</span>
                    <span className="text-[10px] text-text-soft">{formatDate(n.created_at)}</span>
                  </span>
                  {!n.read_at && <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />}
                </button>
              </li>
            );
          })}
          {hasMore && (
            <li className="border-t border-border px-5 py-3 text-center">
              <button type="button" onClick={loadMore} disabled={loadingMore} className="text-xs font-semibold text-primary hover:underline disabled:cursor-wait disabled:opacity-60">
                {loadingMore ? t("common.loading") : t("dashboard.loadMoreNotifications")}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
