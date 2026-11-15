"use client";

import { useApiQuery } from "@/lib/api/hooks";

export interface FaqItem {
  uuid: string;
  question: string;
  answer: string;
}

/** Loads the active FAQs in display order (`GET /api/v1/faqs`, public, managed from the admin dashboard). */
export function useFaqs() {
  const { data, isLoading } = useApiQuery<{ items: FaqItem[] }>(["faqs"], "/api/v1/faqs", undefined, { staleTime: 5 * 60 * 1000 });

  return { faqs: data?.items ?? [], loading: isLoading };
}
