"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { Pagination } from "@/components/ui/Pagination";
import { SearchIcon } from "@/components/ui/Icons";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageBanner } from "@/components/layout/PageBanner";
import { MySubjectCard } from "./MySubjectCard";
import { useMySubjects } from "../hooks/useMySubjects";

/** Dashboard "my subjects" listing — the student's own subscribed subjects (`GET /user/v1/subjects`). */
export function MySubjectsListing() {
  const { t } = useT();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { subjects, meta, loading, error } = useMySubjects({ q: q || undefined, page });

  return (
    <div className="flex flex-col gap-6">
      <PageBanner title={<span className="marker">{t("subjects.dashboardTitle")}</span>} subtitle={t("subjects.dashboardSubtitle")} />
      <label className="flex h-11 items-center rounded-full bg-surface px-4 md:w-96">
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
      {error ? (
        <ErrorState />
      ) : !loading && subjects.length === 0 ? (
        <ErrorState title={t("subjects.noSubjectsTitle")} message={t("subjects.noSubjectsText")} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <MySubjectCard key={s.uuid} subject={s} />
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
