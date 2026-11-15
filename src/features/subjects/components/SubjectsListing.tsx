"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { Pagination } from "@/components/ui/Pagination";
import { PillTabs } from "@/components/ui/Tabs";
import { SearchIcon } from "@/components/ui/Icons";
import { ErrorState } from "@/components/ui/ErrorState";
import { CoursesGrid } from "@/features/courses/components/CoursesGrid";
import { useCourses } from "@/features/courses/hooks/useCourses";

const PER_PAGE = 18;

/**
 * Public subjects listing (Figma): search + grade pills, a 3-column grid of course cards (thumbnail, subject tags,
 * title, original/discounted price, CTA), then the results counter and numbered pagination over a dotted grid.
 * Grade pills are decorative — not a supported server filter. Every visit shuffles the courses with a fresh `seed`,
 * kept for the whole visit so the pages share one order and never repeat a course.
 */
export function SubjectsListing() {
  const { t } = useT();
  const [grade, setGrade] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000_000) + 1);
  const { courses, meta, loading, error } = useCourses({ q: q || undefined, page, per_page: PER_PAGE, seed });

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex h-11 flex-1 items-center rounded-full bg-surface px-4">
          <SearchIcon size={18} className="text-text-muted" />
          <input
            className="w-full bg-transparent px-3 text-xs outline-none placeholder:text-text-soft"
            placeholder={t("common.searchCourse")}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <PillTabs
          value={grade}
          onChange={setGrade}
          items={[
            { key: "all", label: t("common.all") },
            { key: "11", label: t("common.grade11") },
            { key: "12", label: t("common.grade12") },
          ]}
        />
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="h-[380px] animate-pulse rounded-2xl border border-border bg-surface" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <ErrorState title={t("subjects.noCoursesTitle")} message={t("subjects.noCoursesText")} />
      ) : (
        <CoursesGrid courses={courses} />
      )}
      {meta && (
        <div className="relative flex items-center justify-between overflow-hidden rounded-2xl px-2 py-4">
          {/* Large yellow radial halftone on the far RIGHT behind the results counter (Figma UI-43); pagination stays clean. */}
          <span className="dots-matrix-yellow pointer-events-none absolute -start-10 -top-10 size-44 rounded-full [mask-image:radial-gradient(circle,#000_30%,transparent_70%)]" aria-hidden />
          <span className="relative text-sm text-text-muted">{t("common.showing", { count: courses.length, total: meta.total, label: t("common.subjectsLabel") })}</span>
          <Pagination page={page} total={Math.max(1, meta.last_page)} onChange={setPage} className="relative" />
        </div>
      )}
    </div>
  );
}
