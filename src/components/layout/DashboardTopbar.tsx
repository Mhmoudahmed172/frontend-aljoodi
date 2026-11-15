"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { Avatar } from "@/components/ui/Avatar";
import { BellIcon, ChevronDownIcon, ListIcon, SearchIcon } from "@/components/ui/Icons";
import { NotificationsPopover } from "./NotificationsPopover";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { ProfileMenu } from "./ProfileMenu";

interface DashboardTopbarProps {
  name?: string;
  role?: string;
  avatar?: string;
  onMenu?: () => void;
}

export function DashboardTopbar({ name, role, avatar, onMenu }: DashboardTopbarProps) {
  const { t } = useT();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = name ?? "";
  const displayRole = role ?? t("dashboard.userRole");
  const { unreadCount } = useNotifications();

  return (
    <header className="flex h-16 items-center justify-between gap-3 bg-surface px-4 md:h-[76px] md:px-8 lg:ps-9 lg:pe-[72px]">
      <button type="button" onClick={onMenu} className="flex size-10 shrink-0 items-center justify-center text-text lg:hidden" aria-label="menu">
        <ListIcon size={24} />
      </button>
      <label className="relative hidden h-11 w-full max-w-[620px] items-center rounded-full bg-white px-4 sm:flex">
        <SearchIcon size={18} className="text-text-muted" />
        <input className="w-full bg-transparent px-3 text-xs text-text outline-none placeholder:text-text-soft" placeholder={t("common.search")} />
      </label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setMenuOpen(false);
            }}
            className="relative flex size-9 items-center justify-center text-text"
            aria-label={t("dashboard.notifications")}
          >
            <BellIcon size={22} />
            {unreadCount > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white" dir="ltr">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && <NotificationsPopover onClose={() => setNotifOpen(false)} />}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-3"
          >
            <Avatar src={avatar} alt={displayName} size={40} />
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-xs font-bold text-text-heading">{displayName}</span>
              <span className="text-[10px] text-text-muted">{displayRole}</span>
            </span>
            <ChevronDownIcon size={16} className="text-text-muted" />
          </button>
          {menuOpen && <ProfileMenu name={displayName} avatar={avatar} onClose={() => setMenuOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
