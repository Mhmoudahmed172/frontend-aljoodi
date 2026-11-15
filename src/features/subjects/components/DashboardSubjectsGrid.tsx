"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { DashboardCourseCard } from "./DashboardCourseCard";
import { useSubjects } from "../hooks/useSubjects";

/** Home widget: "My subjects" title + 3 course cards. */
export function DashboardSubjectsPreview() {
  const { t } = useT();
  const { subjects } = useSubjects({ per_page: 3 });
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-text-heading">{t("dashboard.mySubjects")}</h2>
        <Link href="/dashboard/subjects" className="text-[11px] font-semibold text-primary">
          {t("common.viewAll")}
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.slice(0, 3).map((s) => (
          <DashboardCourseCard key={s.uuid} subject={s} />
        ))}
      </div>
    </section>
  );
}
