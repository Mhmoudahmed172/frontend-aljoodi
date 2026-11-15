'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { LocaleProvider, defaultLocale } from '@/lib/i18n'
import { ToastProvider } from '@/components/layout/ToastProvider'
import { AuthSessionBoundary } from '@/components/wrappers/AuthSessionBoundary'
import { ClarityTracker } from '@/components/wrappers/ClarityTracker'
import { ContextMenuGuard } from '@/components/wrappers/ContextMenuGuard'
import { DevToolsShortcutGuard } from '@/components/wrappers/DevToolsShortcutGuard'
import { PlayerCrashReporter } from '@/features/subjects/components/PlayerCrashReporter'
import type { ChildrenType } from '@/types/component-props'

/**
 * Provider tree: react-query (framework-agnostic, kept from the real API integration layer)
 * -> LocaleProvider (new_front's lightweight i18n) -> ToastProvider (sonner) -> children.
 *
 * Note: the old Bootstrap-era `LayoutProvider` (dark-mode), `NotificationProvider` (Bootstrap
 * toast) and `ConfirmProvider` (Bootstrap confirm modal) were removed — sonner replaces toasts,
 * and no copied new_front screen currently needs an imperative confirm dialog. If a future
 * screen (e.g. "delete account") needs one, port a Tailwind `ConfirmDialog` then.
 */
const AppProvidersWrapper = ({ children }: ChildrenType) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: (count, error) => count < 1 && !(error as { status?: number })?.status, refetchOnWindowFocus: false },
          mutations: { retry: 0 },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={defaultLocale}>
        <AuthSessionBoundary />
        <ContextMenuGuard />
        <DevToolsShortcutGuard />
        <PlayerCrashReporter />
        <ClarityTracker />
        {children}
        <ToastProvider />
      </LocaleProvider>
    </QueryClientProvider>
  )
}
export default AppProvidersWrapper
