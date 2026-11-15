"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { subjectCourseHref } from "@/features/subjects/utils/teachers";
import { formatPrices } from "../utils/prices";
import type { CourseCard as CourseCardData } from "../types/course.types";

const BRANCH_LABEL_KEYS: Record<string, string> = {
  scientific: "common.scientific",
  literary: "common.literary",
  sharia: "common.sharia",
};

/** Public course card: logo, first teacher's photo on a blue blob, branch/subject tags, every teacher's name, price and a subscribe CTA. */
export function CourseCard({ course }: { course: CourseCardData }) {
  const { t } = useT();
  const [coverBroken, setCoverBroken] = useState(false);
  const branch = course.branches[0];
  const { current, original } = formatPrices(course.prices);
  const teachers = course.teachers ?? (course.teacher ? [course.teacher] : []);
  const teacherNames = teachers.map((teacher) => teacher.name).filter(Boolean).join(" - ");
  const href = subjectCourseHref(course.subject.slug, course.slug);
  const branchLabel = t(branch ? (BRANCH_LABEL_KEYS[branch] ?? "common.tawjihi") : "common.allBranches");

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-center justify-between">
        <Logo width={56} href="" />
        <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-semibold text-text-heading">
          {t("subjects.branchLabel", { branch: branchLabel })}
        </span>
      </div>
      <Link href={href} className="relative mt-2 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-primary-faint">
        {course.cover_url && !coverBroken ? (
          <Image src={course.cover_url} alt={course.name} fill className="object-cover" sizes="360px" onError={() => setCoverBroken(true)} />
        ) : (
          <>
            <Image src="/images/blob-blue@2x.png" alt="" width={330} height={299} className="absolute start-1/2 top-0 h-32 w-auto -translate-x-1/2 rtl:translate-x-1/2" />
            <Image src={teachers[0]?.photo_url ?? "/images/mascot-question.png"} alt={teachers[0]?.name ?? ""} width={160} height={160} className="relative h-28 w-auto object-contain" />
          </>
        )}
        <span className="absolute end-2 top-2 rounded-md bg-accent px-2 py-1 text-[10px] font-semibold text-text-heading shadow-sm">{t("subjects.firstSemester")}</span>
        <Image src="/images/decor-sparkle.png" alt="" width={24} height={20} className="pointer-events-none absolute bottom-2 start-2 w-5" />
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-semibold text-primary">{course.subject.name}</span>
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-text-muted">{t("common.tawjihi")}</span>
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-text-muted">{branchLabel}</span>
      </div>
      <Link href={href} className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-text-heading">
        {course.name}
        {teacherNames && <span className="font-semibold text-primary"> / {teacherNames}</span>}
      </Link>
      <div className={cn("mt-3 flex items-center justify-between border-t border-border pt-3")}>
        <div className="flex items-baseline gap-2">
          {original && (
            <span className="text-xs text-text-muted line-through">
              {original} {t("common.currency")}
            </span>
          )}
          {current && (
            <span className="text-base font-bold text-primary">
              {current} {t("common.currency")}
            </span>
          )}
        </div>
        <Link href={href}>
          <Button size="md" className="h-10 px-6 text-xs">
            {t("common.subscribeNow")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
