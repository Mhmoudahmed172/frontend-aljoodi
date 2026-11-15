"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { BookOpenIcon, ClockIcon, FileCheckIcon } from "@/components/ui/Icons";
import type { Exam } from "../types/exam.types";

export function ExamRow({ exam, className }: { exam: Exam; className?: string }) {
  const { t } = useT();
  const label = exam.state === "start" ? t("exams.start") : exam.state === "result" ? t("exams.viewResult") : t("exams.view");
  return (
    <div className={cn("flex items-center justify-between gap-4 py-3", className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
          <FileCheckIcon size={18} />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-text-heading">{exam.title}</span>
          <span className="flex items-center gap-3 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <BookOpenIcon size={12} className="text-accent" />
              {exam.subject}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon size={12} className="text-accent" />
              {t(`common.${exam.day}`)} {exam.time}
            </span>
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(
          "rounded-full px-4 py-1.5 text-[11px] font-bold",
          exam.state === "start" ? "bg-primary text-white" : "bg-primary-soft text-primary",
        )}
      >
        {label}
      </button>
    </div>
  );
}
