"use client";

import { useQuery } from "@tanstack/react-query";
import { apiProxy, type ApiError } from "@/lib/api";
import type { AuthUser } from "../types/auth.types";

/**
 * `GET /auth/me`, routed through `/api/proxy` (see `src/app/api/proxy/[...path]/route.ts`) since
 * the httpOnly session cookie isn't readable from client JS. Used to hydrate the dashboard chrome
 * (`DashboardTopbar`/`ProfileMenu`/`WelcomeBanner`) with the real signed-in user.
 */
export function useCurrentUser(enabled = true) {
  return useQuery<AuthUser, ApiError>({
    queryKey: ["auth", "me"],
    queryFn: () => apiProxy.get<AuthUser>("/api/auth/me"),
    staleTime: 60_000,
    retry: false,
    // Public pages pass `enabled=false` for guests: a 401 here would trigger the global "go to login" handler.
    enabled,
  });
}
