"use client";

import { useState } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useT } from "@/lib/i18n";
import { PageBanner } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { PillTabs } from "@/components/ui/Tabs";
import { SearchIcon } from "@/components/ui/Icons";
import { useLibraryFiles, useLibrarySubjects } from "../hooks/useLibrary";
import { LIBRARY_FILE_TYPES, type LibraryFileSource, type LibraryFileType } from "../types/library.types";
import { EmptyLibrary } from "./EmptyLibrary";
import { LibraryFileRow } from "./LibraryFileRow";
import { LibrarySubjectFilter } from "./LibrarySubjectFilter";

type SourceFilter = "all" | LibraryFileSource;

const PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 400;

/**
 * "Library" dashboard page: every course + lesson file of the subjects the student is actively subscribed to.
 * Subject cards come from `GET /user/v1/library`; the list from `GET /user/v1/library/files` filtered by subject,
 * debounced search, source and type. Without any subscription the page explains the library is subscribers-only.
 */
export function LibraryPageContent() {
  const { t } = useT();
  const [subject, setSubject] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [type, setType] = useState<LibraryFileType | "all">("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  const { subjects, loading: subjectsLoading, error: subjectsError, refetch: refetchSubjects } = useLibrarySubjects();
  const hasSubjects = subjects.length > 0;
  const {
    files,
    meta,
    loading: filesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useLibraryFiles(
    {
      subject: subject ?? undefined,
      search: debouncedSearch || undefined,
      source: source === "all" ? undefined : source,
      type: type === "all" ? undefined : type,
      page,
      per_page: PER_PAGE,
    },
    hasSubjects,
  );

  const filtered = Boolean(subject || debouncedSearch || source !== "all" || type !== "all");

  const resetFilters = () => {
    setSubject(null);
    setSearch("");
    setSource("all");
    setType("all");
    setPage(1);
  };

  const sources = [
    { key: "all", label: t("library.sourceAll") },
    { key: "course", label: t("library.sourceCourse") },
    { key: "lesson", label: t("library.sourceLesson") },
  ];

  const banner = <PageBanner title={<span className="marker">{t("library.pageTitle")}</span>} subtitle={t("library.pageSubtitle")} />;

  if (subjectsError) {
    return (
      <div className="flex flex-col gap-6">
        {banner}
        <ErrorState title={t("library.loadErrorTitle")} message={t("library.loadError")} onRetry={() => refetchSubjects()} />
      </div>
    );
  }

  if (!subjectsLoading && !hasSubjects) {
    return (
      <div className="flex flex-col gap-6">
        {banner}
        <EmptyLibrary />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {banner}

      {subjectsLoading ? (
        <div className="flex gap-3 overflow-hidden pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-40 shrink-0 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : (
        <LibrarySubjectFilter
          subjects={subjects}
          value={subject}
          onChange={(uuid) => {
            setSubject(uuid);
            setPage(1);
          }}
        />
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex h-11 items-center rounded-full bg-surface px-4 lg:w-96">
          <SearchIcon size={18} className="shrink-0 text-text-muted" />
          <input
            type="search"
            className="w-full bg-transparent px-3 text-xs outline-none placeholder:text-text-soft"
            placeholder={t("library.searchPlaceholder")}
            aria-label={t("library.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <PillTabs
            items={sources}
            value={source}
            onChange={(key) => {
              setSource(key as SourceFilter);
              setPage(1);
            }}
          />
          <select
            className="h-11 rounded-full bg-primary px-6 text-xs font-bold text-white outline-none"
            aria-label={t("library.typeLabel")}
            value={type}
            onChange={(e) => {
              setType(e.target.value as LibraryFileType | "all");
              setPage(1);
            }}
          >
            <option value="all">{t("library.typeAll")}</option>
            {LIBRARY_FILE_TYPES.map((value) => (
              <option key={value} value={value}>
                {t(`library.types.${value}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filesError ? (
        <ErrorState title={t("library.loadErrorTitle")} message={t("library.loadError")} onRetry={() => refetchFiles()} />
      ) : subjectsLoading || filesLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center gap-3">
          <ErrorState
            title={filtered ? t("library.noResultsTitle") : t("library.emptyFilesTitle")}
            message={filtered ? t("library.noResultsText") : t("library.emptyFilesText")}
          />
          {filtered && (
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              {t("library.clearFilters")}
            </Button>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {files.map((file) => (
            <LibraryFileRow key={file.uuid} file={file} />
          ))}
        </ul>
      )}

      {!filesError && meta && meta.last_page > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-text-muted">{t("common.showing", { count: files.length, total: meta.total, label: t("library.filesLabel") })}</span>
          <div className="max-w-full overflow-x-auto">
            <Pagination page={page} total={meta.last_page} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
