"use client";

import { useQuery } from "@tanstack/react-query";

interface SessionStatus {
  authenticated: boolean;
}

/**
 * `GET /api/session/status` — same-origin BFF check for the httpOnly session cookie.
 * Lets public pages (which serve guests too) know whether to render the signed-in header
 * before touching any authenticated endpoint.
 */
export function useSessionStatus() {
  return useQuery<SessionStatus>({
    queryKey: ["auth", "session-status"],
    queryFn: async () => {
      const response = await fetch("/api/session/status", { cache: "no-store" });

      if (!response.ok) return { authenticated: false };

      return (await response.json()) as SessionStatus;
    },
    staleTime: 60_000,
    retry: false,
  });
}
