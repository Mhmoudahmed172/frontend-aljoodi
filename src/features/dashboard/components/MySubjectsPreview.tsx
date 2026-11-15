"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { MySubjectCard } from "./MySubjectCard";
import { useMySubjects } from "../hooks/useMySubjects";

/**
 * Home widget (Figma UI-50): "My subjects" title (right) + "view all" link (left) and up to 3 subscribed subject cards
 * (`GET /user/v1/subjects`). With no subscriptions the section stays visible and renders the Figma empty state:
 * #ECF6FE banner with a dashed #99B9E5 border, mascot, message, subtext and a primary "subscribe now" CTA.
 */
export function MySubjectsPreview() {
  const { t } = useT();
  const { subjects, loading, error } = useMySubjects({ per_page: 3 });

  if (loading || error) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-text-heading">{t("dashboard.mySubjects")}</h2>
        <Link href="/dashboard/subjects" className="text-[11px] font-semibold text-primary">
          {t("common.viewAll")}
        </Link>
      </div>
      {subjects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary-soft bg-sky px-6 py-8 text-center">
          <Image src="/images/mascot-question.png" alt="" width={120} height={90} className="w-28" />
          <p className="text-sm font-bold text-text-heading">{t("subjects.noSubjectsTitle")}</p>
          <p className="text-xs text-text-muted">{t("subjects.noSubjectsText")}</p>
          <Link href="/subjects" className="mt-2">
            <Button className="h-10 px-8 text-xs">{t("common.subscribeNow")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.slice(0, 3).map((s) => (
            <MySubjectCard key={s.uuid} subject={s} />
          ))}
        </div>
      )}
    </section>
  );
}
