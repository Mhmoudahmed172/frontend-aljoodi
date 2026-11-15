"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Subject } from "../types/subject.types";

/** Dashboard course card: thumbnail, name, teacher count and continue CTA. `progress` renders only when present. */
export function DashboardCourseCard({ subject }: { subject: Subject }) {
  const { t } = useT();
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-3">
      <Logo width={56} href="" />
      <Link href={`/dashboard/subjects/${subject.slug}`} className="relative mt-2 h-32 overflow-hidden rounded-xl bg-primary-faint">
        <Image src={subject.icon_url ?? "/images/mascot-book.png"} alt={subject.name} fill className="object-contain p-4" sizes="300px" />
      </Link>
      <Link href={`/dashboard/subjects/${subject.slug}`} className="mt-2 text-xs font-bold leading-6 text-text-heading">
        {subject.name}
      </Link>
      <div className="mt-2 text-[11px] text-text-muted">
        {subject.teachers_count} {t("common.teachersLabel")}
      </div>
      {subject.progress !== undefined && <ProgressBar value={subject.progress} label={t("common.progressLevel")} className="mt-3" />}
      <Link href={`/dashboard/subjects/${subject.slug}`} className="mt-3">
        <Button fullWidth className="h-9 text-xs">
          {t("common.continue")}
        </Button>
      </Link>
    </div>
  );
}
