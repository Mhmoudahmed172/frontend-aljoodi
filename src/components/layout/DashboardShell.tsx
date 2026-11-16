'use client'

import { useState, type ReactNode } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'
import { DashboardUserProvider, useDashboardUser } from './DashboardUserContext'

function DashboardChrome({ children, onMenu }: { children: ReactNode; onMenu: () => void }) {
  const { user } = useDashboardUser()
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <DashboardTopbar onMenu={onMenu} name={user?.name} avatar={user?.avatar_url ?? undefined} />
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 lg:ps-9 lg:pe-[72px]">{children}</main>
    </div>
  )
}

/** Sidebar + topbar frame for all dashboard pages. The sidebar becomes a drawer below lg. Hydrates the real signed-in user via `GET /auth/me`. */
export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <DashboardUserProvider>
      <div className="brand-dashboard flex min-h-screen">
        <DashboardSidebar open={open} onClose={() => setOpen(false)} />
        <DashboardChrome onMenu={() => setOpen(true)}>{children}</DashboardChrome>
      </div>
    </DashboardUserProvider>
  )
}
