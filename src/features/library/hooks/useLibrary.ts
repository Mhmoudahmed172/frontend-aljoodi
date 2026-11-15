"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { apiProxy } from "@/lib/api";
import { useApiQuery } from "@/lib/api/hooks";
import type { LibraryFilesFilters, LibraryFilesPage, LibrarySubjectsResponse } from "../types/library.types";

export const LIBRARY_KEYS = {
  all: ["library"] as const,
  subjects: ["library", "subjects"] as const,
  files: ["library", "files"] as const,
};

/** `GET /user/v1/library` — the subscribed subjects shown as the library's subject filter. */
export function useLibrarySubjects() {
  const { data, isLoading, error, refetch } = useApiQuery<LibrarySubjectsResponse>([...LIBRARY_KEYS.subjects], "/user/v1/library", undefined, { retry: false }, apiProxy);

  return { subjects: data?.items ?? [], loading: isLoading, error, refetch };
}

/** `GET /user/v1/library/files` — the filtered, paginated files list; keeps the previous page on screen while the next one loads. */
export function useLibraryFiles(filters?: LibraryFilesFilters, enabled = true) {
  const { data, isLoading, isFetching, error, refetch } = useApiQuery<LibraryFilesPage>(
    [...LIBRARY_KEYS.files],
    "/user/v1/library/files",
    filters as Record<string, unknown> | undefined,
    { retry: false, enabled, placeholderData: keepPreviousData },
    apiProxy,
  );

  return { files: data?.items ?? [], meta: data?.meta, loading: isLoading, fetching: isFetching, error, refetch };
}
