"use client";

import { apiProxy } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import type { ContinueLearningItem, DashboardSummary } from "../types/dashboard.types";

/** `GET /user/v1/dashboard/summary` — active subscriptions / completed lessons / wallet balance. */
export function useDashboardSummary() {
  const { data, isLoading, error } = useApiQuery<DashboardSummary>(["dashboard", "summary"], "/user/v1/dashboard/summary", undefined, undefined, apiProxy);

  return { summary: data, loading: isLoading, error };
}

/** `GET /user/v1/dashboard/continue-learning` — up to 5 in-progress subscriptions. */
export function useContinueLearning() {
  const { data, isLoading, error } = useApiQuery<{ items: ContinueLearningItem[] }>(
    ["dashboard", "continue-learning"],
    "/user/v1/dashboard/continue-learning",
    undefined,
    undefined,
    apiProxy,
  );

  return { items: data?.items ?? [], loading: isLoading, error };
}
