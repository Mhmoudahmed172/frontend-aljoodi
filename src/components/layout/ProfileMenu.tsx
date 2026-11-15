"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { GlobeIcon, LogoutIcon, UserIcon } from "@/components/ui/Icons";
import { LogoutDialog } from "./LogoutDialog";

interface ProfileMenuProps {
  name: string;
  avatar?: string | null;
  onClose: () => void;
}

/**
 * Dashboard profile dropdown (Figma UI-57): opens directly below the avatar trigger, anchored to the trigger's LEFT
 * edge (`end-0` in RTL) so it grows towards the page instead of off-screen. Logout goes through `LogoutDialog`.
 */
export function ProfileMenu({ name, avatar, onClose }: ProfileMenuProps) {
  const { t, locale } = useT();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <div className="absolute end-0 top-14 z-40 w-[270px] rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center gap-3">
          <Avatar src={avatar} alt={name} size={44} />
          <span className="text-sm font-bold text-text-heading">{name}</span>
        </div>
        <Link href="/dashboard/profile" onClick={onClose} className="mt-5 flex items-center gap-3 text-sm text-text hover:text-primary">
          <UserIcon size={18} className="text-text-muted" />
          {t("common.viewProfile")}
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-3 text-sm text-text">
            <GlobeIcon size={18} className="text-text-muted" />
            {t("common.language")}
          </span>
          <span className="inline-flex overflow-hidden rounded-md border border-border text-[11px] font-bold" dir="ltr">
            {(["ar", "en"] as const).map((l) => (
              <span key={l} className={cn("px-3 py-1", locale === l ? "bg-primary text-white" : "text-text-muted")}>
                {l.toUpperCase()}
              </span>
            ))}
          </span>
        </div>
        <div className="my-4 border-t border-border" />
        <button type="button" onClick={() => setLogoutOpen(true)} className="flex items-center gap-3 text-sm font-semibold text-danger">
          <LogoutIcon size={18} />
          {t("common.logout")}
        </button>
      </div>
      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}
