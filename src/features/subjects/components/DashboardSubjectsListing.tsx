"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { PageBanner } from "@/components/layout/PageBanner";
import { Pagination } from "@/components/ui/Pagination";
import { PillTabs } from "@/components/ui/Tabs";
import { SearchIcon } from "@/components/ui/Icons";
import { ErrorState } from "@/components/ui/ErrorState";
import { DashboardCourseCard } from "./DashboardCourseCard";
import { useSubjects } from "../hooks/useSubjects";

/**
 * Dashboard subjects listing. The "in progress / completed" filter is UI-only for now — the public
 * catalog endpoint this feeds from carries no per-student status; it'll become a real server filter
 * once a "my subjects" endpoint exists.
 */
export function DashboardSubjectsListing() {
  const { t } = useT();
  const [statusFilter, setStatusFilter] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { subjects, meta, loading, error } = useSubjects({ q: q || undefined, page });

  return (
    <div className="flex flex-col gap-6">
      <PageBanner title={<span className="marker">{t("subjects.dashboardTitle")}</span>} subtitle={t("subjects.dashboardSubtitle")} />
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex h-11 flex-1 items-center rounded-full bg-surface px-4">
          <SearchIcon size={18} className="text-text-muted" />
          <input
            className="w-full bg-transparent px-3 text-xs outline-none placeholder:text-text-soft"
            placeholder={t("common.search")}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <PillTabs
          value={statusFilter}
          onChange={setStatusFilter}
          items={[
            { key: "all", label: t("common.all") },
            { key: "inProgress", label: t("subjects.inProgress") },
            { key: "completed", label: t("subjects.completed") },
          ]}
        />
      </div>
      {error ? (
        <ErrorState />
      ) : !loading && subjects.length === 0 ? (
        <ErrorState title={t("subjects.noSubjectsTitle")} message={t("subjects.noSubjectsText")} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <DashboardCourseCard key={s.uuid} subject={s} />
          ))}
        </div>
      )}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{t("common.showing", { count: subjects.length, total: meta.total, label: t("common.subjectsLabel") })}</span>
          <Pagination page={page} total={meta.last_page} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
