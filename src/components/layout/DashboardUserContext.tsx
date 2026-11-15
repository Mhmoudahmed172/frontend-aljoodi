"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { AuthUser } from "@/features/auth/types/auth.types";

interface DashboardUserContextValue {
  user?: AuthUser;
  isLoading: boolean;
}

const DashboardUserContext = createContext<DashboardUserContextValue>({ user: undefined, isLoading: true });

/** Fetches `GET /auth/me` once (via the `/api/proxy`-routed `apiProxy` client) and shares it across the dashboard tree. */
export function DashboardUserProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useCurrentUser();
  return <DashboardUserContext.Provider value={{ user: data, isLoading }}>{children}</DashboardUserContext.Provider>;
}

/** Reads the signed-in user hydrated by `DashboardUserProvider` (mounted in `DashboardShell`). */
export function useDashboardUser() {
  return useContext(DashboardUserContext);
}
