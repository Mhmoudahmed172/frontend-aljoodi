"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { BookOpenIcon, ClockIcon } from "@/components/ui/Icons";
import { useDashboardSummary } from "../hooks/useDashboard";
import { useMySubjects } from "../hooks/useMySubjects";

/**
 * Weekly progress card (Figma UI-49): 380px white card, radius 8, 1px #F2F2F2 border. Right-aligned title with a yellow
 * accent above it; doughnut ring on the left (green percentage, primary arc, #ECF6FE tint wave + mascot at the
 * bottom-left) and the metrics list on the right (completed lessons / study hours with #ECF6FE icon badges).
 * The percentage is the average `progress` of the student's subjects (`GET /user/v1/subjects`), the lesson count comes
 * from the dashboard summary; there is no study-time endpoint yet, so hours read 0. Quizzes are hidden (no exam feature).
 */
export function WeeklyProgress() {
  const { t } = useT();
  const { summary } = useDashboardSummary();
  const { subjects } = useMySubjects();
  const percent = subjects.length > 0 ? Math.round(subjects.reduce((sum, s) => sum + (s.progress ?? 0), 0) / subjects.length) : 0;
  const metrics = [
    { icon: <BookOpenIcon size={18} />, value: summary?.completed_lessons_count ?? 0, label: t("dashboard.lessonsDone") },
    { icon: <ClockIcon size={18} />, value: 0, label: t("dashboard.hoursLearned") },
  ];

  return (
    <div className="relative flex min-h-[380px] flex-col overflow-hidden rounded-lg border border-border-light bg-white p-6">
      <div className="relative self-start">
        <Image src="/images/decor-sparkle.png" alt="" width={30} height={26} className="pointer-events-none absolute -top-5 -end-6 w-6" />
        <h3 className="text-base font-bold text-text-heading">{t("dashboard.progressTitle")}</h3>
      </div>
      <div className="mt-6 grid flex-1 gap-6 sm:grid-cols-2 sm:items-center">
        <ul className="flex flex-col gap-4">
          {metrics.map((m) => (
            <li key={m.label} className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky text-primary">{m.icon}</span>
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-text-heading" dir="ltr">
                  {m.value}
                </span>
                <span className="text-xs text-text-muted">{m.label}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="relative flex items-center justify-center py-4">
          <span className="pointer-events-none absolute inset-x-0 -bottom-10 h-40 rounded-[50%] bg-sky" aria-hidden />
          <Ring percent={percent} />
          <Image src="/images/mascot-trophy.png" alt="" width={80} height={80} className="pointer-events-none absolute -bottom-2 end-0 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Doughnut: primary arc over a #ECF6FE track, green percentage in the middle. */
function Ring({ percent }: { percent: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative size-40">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-sky)" strokeWidth="14" />
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-primary)" strokeWidth="14" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * clamped) / 100} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-success-strong" dir="ltr">
        {clamped}%
      </span>
    </div>
  );
}
