"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { BellIcon, ChevronDownIcon, CloseIcon, ListIcon, LogoutIcon, UserIcon } from "@/components/ui/Icons";
import { LogoutDialog } from "@/components/layout/LogoutDialog";
import { NotificationsPopover } from "@/components/layout/NotificationsPopover";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useSessionStatus } from "@/features/auth/hooks/useSessionStatus";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const links = [
  { key: "nav.home", href: "/" },
  { key: "nav.teachers", href: "/teachers" },
  { key: "nav.subjects", href: "/subjects" },
  { key: "nav.about", href: "/about" },
  { key: "nav.guide", href: "/guide" },
  { key: "nav.contact", href: "/contact" },
];

interface PublicHeaderProps {
  /** Floating header laid over the landing hero gradient; shrinks into a pill on scroll. */
  overlay?: boolean;
}

/**
 * Public site header. Decides between the guest (login button) and signed-in (avatar + bell)
 * variants from the real session: cookie presence via `/api/session/status`, then the user's
 * name/avatar from `GET /auth/me`.
 */
export function PublicHeader({ overlay = false }: PublicHeaderProps) {
  const { t } = useT();
  const { data: session } = useSessionStatus();
  const loggedIn = session?.authenticated === true;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    if (!overlay) return;

    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  return (
    <>
      <header className={cn("z-40 animate-header-in", overlay ? "fixed inset-x-0 top-3 md:top-5" : "relative bg-white")}>
        <div
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            overlay
              ? cn(
                  "h-14 w-[calc(100%-24px)] rounded-full border px-4 md:h-16 md:px-5",
                  scrolled
                    ? "max-w-[960px] border-white/70 bg-white/90 shadow-[0_18px_40px_-20px_rgba(0,58,140,0.35)] backdrop-blur-md"
                    : "max-w-[1120px] border-transparent bg-transparent shadow-none",
                )
              : "h-16 w-full max-w-[1120px] px-5 md:h-[88px] md:px-6 xl:px-0",
          )}
        >
          <Logo width={104} className="w-20 shrink-0 md:w-[104px]" />
          <nav className="hidden items-center gap-7 md:flex xl:gap-9">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative py-1 text-[13px] font-semibold text-text transition-colors after:absolute after:-bottom-0.5 after:start-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-primary hover:after:w-full",
                  isActive(l.href) && "font-bold text-primary after:w-full",
                )}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">{loggedIn ? <UserActions /> : <LoginButton label={t("nav.login")} />}</div>
          <button type="button" onClick={() => setOpen(true)} className="flex size-10 shrink-0 items-center justify-center text-text md:hidden" aria-label="menu">
            <ListIcon size={24} />
          </button>
        </div>
      </header>

      {overlay && <div aria-hidden className="h-20 md:h-28" />}

      <div
        className={cn("fixed inset-0 z-50 transition-opacity duration-300 md:hidden", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-text-heading/40" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute inset-y-0 end-0 flex w-[280px] flex-col bg-white p-5 shadow-card transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Logo width={90} />
            <button type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full bg-surface text-text-muted" aria-label={t("common.close")}>
              <CloseIcon size={18} />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn("rounded-xl px-4 py-3 text-sm font-semibold text-text transition-colors hover:bg-primary-subtle hover:text-primary", isActive(l.href) && "bg-primary-subtle font-bold text-primary")}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">{loggedIn ? <UserActions /> : <LoginButton label={t("nav.login")} fullWidth />}</div>
        </div>
      </div>
    </>
  );
}

function LoginButton({ label, fullWidth }: { label: string; fullWidth?: boolean }) {
  return (
    <Link href="/login" className={cn(fullWidth && "block")}>
      <Button className="h-10 px-7 text-[13px]" fullWidth={fullWidth}>
        {label}
      </Button>
    </Link>
  );
}

function UserActions() {
  const { t } = useT();
  const { data: user } = useCurrentUser();
  const name = user?.name ?? "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();

  // Close on outside click / Escape.
  useEffect(() => {
    if (!menuOpen && !notifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
      if (!notifRef.current?.contains(e.target as Node)) setNotifOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, notifOpen]);

  // Logout asks for confirmation and shows a success dialog first (Figma UI-55/56) — see `LogoutDialog`.
  const handleLogout = () => {
    setMenuOpen(false);
    setLogoutOpen(true);
  };

  return (
    <div className="flex items-center gap-3">
      <div ref={wrapRef} className="relative">
        {/* Avatar + name open the student dashboard; the arrow opens the profile/logout menu. */}
        <div className="flex h-10 items-center rounded-full border border-border bg-white pe-1 ps-2">
          <Link href="/dashboard" className="flex items-center gap-2 pe-2 transition-colors hover:text-primary">
            <Avatar src={user?.avatar_url} alt={name} size={30} />
            <span className="max-w-[140px] truncate text-xs font-bold">{name}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={t("nav.profile")}
            className="flex size-8 items-center justify-center rounded-full text-text-muted transition hover:bg-surface"
          >
            <ChevronDownIcon size={14} className={cn("transition-transform", menuOpen && "rotate-180")} />
          </button>
        </div>
        {menuOpen && (
          <div role="menu" className="absolute end-0 top-12 z-40 w-[220px] rounded-2xl border border-border bg-white p-2 shadow-card">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text transition-colors hover:bg-primary-subtle hover:text-primary"
            >
              <UserIcon size={18} className="text-text-muted" />
              {t("nav.profile")}
            </Link>
            <div className="my-1 border-t border-border" />
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-red-50"
            >
              <LogoutIcon size={18} />
              {t("common.logout")}
            </button>
          </div>
        )}
      </div>
      <div ref={notifRef} className="relative">
        <button
          type="button"
          onClick={() => {
            setNotifOpen((v) => !v);
            setMenuOpen(false);
          }}
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-white text-text"
          aria-label={t("dashboard.notifications")}
        >
          <BellIcon size={18} />
          {unreadCount > 0 && (
            <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white" dir="ltr">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
        {notifOpen && <NotificationsPopover onClose={() => setNotifOpen(false)} />}
      </div>
      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}
