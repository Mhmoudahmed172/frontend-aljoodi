"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { BookIcon, ClockIcon, FileIcon } from "@/components/ui/Icons";
import { useExams } from "../hooks/useExams";
import type { Exam } from "../types/exam.types";

/**
 * "Upcoming quizzes" home widget (Figma UI-48): white 16px-radius card with 24px padding, right-aligned title and a
 * left-aligned "view all" link, then one row per quiz: #ECF6FE document badge → title / subject / time stack → CTA
 * (solid primary "start" when available, muted #99B9E5 "view" otherwise). Rows come from `useExams()`; while no exam
 * API exists that list is empty and the card keeps its frame with a short empty line.
 */
export function UpcomingExams() {
  const { t } = useT();
  const { exams } = useExams();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-text-heading">{t("exams.upcoming")}</h3>
        <Link href="/dashboard/exams" className="text-xs font-semibold text-primary hover:underline">
          {t("exams.viewAll")}
        </Link>
      </div>
      {exams.length === 0 ? (
        <p className="rounded-lg bg-sky px-4 py-6 text-center text-xs text-text-muted">{t("exams.emptyText")}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {exams.map((exam) => (
            <ExamItem key={exam.id} exam={exam} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ExamItem({ exam }: { exam: Exam }) {
  const { t } = useT();
  const available = exam.state === "start";
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky text-primary">
          <FileIcon size={20} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-bold text-text-heading">{exam.title}</span>
          <span className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="flex items-center gap-1 text-accent-strong">
              <BookIcon size={12} />
              {exam.subject}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon size={12} />
              {t(`common.${exam.day}`)} {exam.time}
            </span>
          </span>
        </div>
      </div>
      <Button variant={available ? "primary" : "secondary"} className="h-9 shrink-0 px-5 text-xs">
        {available ? t("exams.start") : t("exams.view")}
      </Button>
    </li>
  );
}
