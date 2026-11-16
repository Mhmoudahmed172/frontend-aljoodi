'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { publicStyles as styles } from '@/components/brand/publicStyles'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { BellIcon, ChevronDownIcon, CloseIcon, ListIcon, LogoutIcon, UserIcon } from '@/components/ui/Icons'
import { LogoutDialog } from '@/components/layout/LogoutDialog'
import { NotificationsPopover } from '@/components/layout/NotificationsPopover'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useSessionStatus } from '@/features/auth/hooks/useSessionStatus'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

const links = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.teachers', href: '/teachers' },
  { key: 'nav.subjects', href: '/subjects' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.guide', href: '/guide' },
  { key: 'nav.contact', href: '/contact' },
]

interface PublicHeaderProps {
  /** Retained for existing callers; public navigation uses a consistent in-flow header. */
  overlay?: boolean
}

/**
 * Public site header. Decides between the guest (login button) and signed-in (avatar + bell)
 * variants from the real session: cookie presence via `/api/session/status`, then the user's
 * name/avatar from `GET /auth/me`.
 */

export function PublicHeader({ overlay = false }: PublicHeaderProps) {
  const { t } = useT()
  const { data: session } = useSessionStatus()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const loggedIn = session?.authenticated === true
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  return (
    <>
      <header className={styles.header} data-overlay={overlay || undefined}>
        <div className={styles.container + ' ' + styles.navbar}>
          <Logo width={126} />
          <nav className={styles.navigation} aria-label="التنقّل الرئيسي">
            {links.map((link) => (
              <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined}>
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className={styles.desktopActions}>{loggedIn ? <UserActions /> : <LoginButton label={t('nav.login')} />}</div>
          <button
            type="button"
            className={styles.menu}
            aria-label="فتح القائمة"
            aria-expanded={open}
            aria-controls="public-menu"
            onClick={() => setOpen(true)}>
            <ListIcon size={26} />
          </button>
        </div>
      </header>
      <div
        id="public-menu"
        className={cn('fixed inset-0 z-50 lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none invisible')}
        role="dialog"
        aria-modal="true"
        aria-label="قائمة التنقّل"
        aria-hidden={!open}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <div className="absolute inset-y-0 end-0 flex w-[min(340px,90vw)] flex-col bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Logo width={110} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق القائمة"
              className="flex size-11 items-center justify-center text-primary">
              <CloseIcon size={22} />
            </button>
          </div>
          <nav className="mt-6 flex flex-col" aria-label="التنقّل على الهاتف">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active(link.href) ? 'page' : undefined}
                className={cn('border-b border-border py-4 text-base text-text', active(link.href) && 'font-bold text-primary')}>
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-6">{loggedIn ? <UserActions /> : <LoginButton label={t('nav.login')} fullWidth />}</div>
        </div>
      </div>
    </>
  )
}

function LoginButton({ label, fullWidth }: { label: string; fullWidth?: boolean }) {
  return (
    <Link href="/login" className={cn(fullWidth && 'block')}>
      <Button className="h-10 px-7 text-[13px] bg-primary text-white hover:bg-primary-hover" fullWidth={fullWidth}>
        {label}
      </Button>
    </Link>
  )
}

function UserActions() {
  const { t } = useT()
  const { data: user } = useCurrentUser()
  const name = user?.name ?? ''
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const { unreadCount } = useNotifications()

  // Close on outside click / Escape.
  useEffect(() => {
    if (!menuOpen && !notifOpen) return
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false)
      if (!notifRef.current?.contains(e.target as Node)) setNotifOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, notifOpen])

  // Logout asks for confirmation and shows a success dialog first (Figma UI-55/56) — see `LogoutDialog`.
  const handleLogout = () => {
    setMenuOpen(false)
    setLogoutOpen(true)
  }

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
            aria-label={t('nav.profile')}
            className="flex size-8 items-center justify-center rounded-full text-text-muted transition hover:bg-surface">
            <ChevronDownIcon size={14} className={cn('transition-transform', menuOpen && 'rotate-180')} />
          </button>
        </div>
        {menuOpen && (
          <div role="menu" className="absolute end-0 top-12 z-40 w-[220px] rounded-2xl border border-border bg-white p-2 shadow-card">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text transition-colors hover:bg-primary-subtle hover:text-primary">
              <UserIcon size={18} className="text-text-muted" />
              {t('nav.profile')}
            </Link>
            <div className="my-1 border-t border-border" />
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-red-50">
              <LogoutIcon size={18} />
              {t('common.logout')}
            </button>
          </div>
        )}
      </div>
      <div ref={notifRef} className="relative">
        <button
          type="button"
          onClick={() => {
            setNotifOpen((v) => !v)
            setMenuOpen(false)
          }}
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-white text-text"
          aria-label={t('dashboard.notifications')}>
          <BellIcon size={18} />
          {unreadCount > 0 && (
            <span
              className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white"
              dir="ltr">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        {notifOpen && <NotificationsPopover onClose={() => setNotifOpen(false)} />}
      </div>
      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  )
}
