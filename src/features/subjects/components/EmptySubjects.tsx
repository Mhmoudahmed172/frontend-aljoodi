"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

/**
 * Empty state shown when the student has no subjects. "Subscribe now" goes to the course catalogue
 * (`/dashboard/explore`): subscribing needs a chosen course, which only a subject's packages provide.
 */
export function EmptySubjects() {
  const { t } = useT();
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-black text-text-heading">{t("dashboard.mySubjects")}</h2>
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary bg-primary-faint px-6 py-8 text-center">
        <Image src="/images/mascot-question.png" alt="" width={120} height={90} className="w-28" />
        <p className="text-sm font-bold text-text-heading">{t("subjects.noSubjectsTitle")}</p>
        <p className="text-xs text-text-muted">{t("subjects.noSubjectsText")}</p>
        <Link href="/dashboard/explore" className="mt-2">
          <Button className="h-10 px-8 text-xs">{t("common.subscribeNow")}</Button>
        </Link>
      </div>
    </section>
  );
}
