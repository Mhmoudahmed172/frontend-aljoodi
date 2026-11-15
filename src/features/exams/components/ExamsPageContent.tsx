"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format";
import { PageBanner } from "@/components/layout/PageBanner";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { PillTabs } from "@/components/ui/Tabs";
import { BookOpenIcon, CheckCircleIcon, ClipboardCheckIcon, ClockIcon, TargetIcon } from "@/components/ui/Icons";
import { StatCard } from "@/features/dashboard/components/StatCards";
import { QuizModal } from "@/features/quizzes/components/QuizModal";
import { useMyQuizAttempts } from "@/features/quizzes/hooks/useQuiz";
import type { MyQuizAttempt, QuizAttemptStatus } from "@/features/quizzes/types/quiz.types";

type Filter = "all" | QuizAttemptStatus;

const PER_PAGE = 10;
/** How many of the latest submitted attempts feed the stat cards (count + average). */
const STATS_SAMPLE = 100;

/**
 * "My quizzes" dashboard page: the student's lesson-quiz attempts from `GET /user/v1/quizzes/attempts` with
 * all / submitted / in-progress filters and stat cards (submitted count, average percent, in-progress count).
 * Rows reopen the quiz modal — to continue a running attempt or to review a submitted one.
 */
export function ExamsPageContent() {
  const { t } = useT();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<MyQuizAttempt | null>(null);

  const { attempts, meta, loading, error } = useMyQuizAttempts({ page, per_page: PER_PAGE, status: filter === "all" ? undefined : filter });
  const { attempts: submitted, loading: statsLoading } = useMyQuizAttempts({ status: "submitted", per_page: STATS_SAMPLE });
  const { meta: inProgressMeta } = useMyQuizAttempts({ status: "in_progress", per_page: 1 });

  const submittedCount = submitted.length;
  const average = submittedCount > 0 ? Math.round(submitted.reduce((sum, a) => sum + (a.percent ?? 0), 0) / submittedCount) : 0;

  const filters = [
    { key: "all", label: t("quizzes.filterAll") },
    { key: "submitted", label: t("quizzes.filterSubmitted") },
    { key: "in_progress", label: t("quizzes.filterInProgress") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageBanner title={<span className="marker">{t("quizzes.pageTitle")}</span>} subtitle={t("quizzes.pageSubtitle")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        <StatCard icon={<CheckCircleIcon size={22} />} label={t("quizzes.statSubmitted")} value={statsLoading ? "—" : String(submittedCount)} tone="green" />
        <StatCard icon={<TargetIcon size={22} />} label={t("quizzes.statAverage")} value={statsLoading ? "—" : t("quizzes.percent", { value: average })} />
        <StatCard icon={<ClockIcon size={22} />} label={t("quizzes.statInProgress")} value={inProgressMeta ? String(inProgressMeta.total) : "—"} tone="orange" />
      </div>

      <PillTabs
        items={filters}
        value={filter}
        onChange={(key) => {
          setFilter(key as Filter);
          setPage(1);
        }}
        className="self-start"
      />

      {error ? (
        <ErrorState />
      ) : loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : attempts.length === 0 ? (
        <ErrorState title={t("quizzes.emptyTitle")} message={t("quizzes.emptyText")} />
      ) : (
        <ul className="flex flex-col gap-3">
          {attempts.map((attempt) => (
            <AttemptRow key={attempt.uuid} attempt={attempt} onOpen={() => setActive(attempt)} />
          ))}
        </ul>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-text-muted">{t("common.showing", { count: attempts.length, total: meta.total, label: t("quizzes.attemptsLabel") })}</span>
          <Pagination page={page} total={meta.last_page} onChange={setPage} />
        </div>
      )}

      <QuizModal slug={active?.subject.slug ?? ""} lesson={active ? { uuid: active.lesson.uuid, title: active.lesson.title } : null} onClose={() => setActive(null)} />
    </div>
  );
}

function AttemptRow({ attempt, onOpen }: { attempt: MyQuizAttempt; onOpen: () => void }) {
  const { t } = useT();
  const submitted = attempt.status === "submitted";
  const tone = submitted ? (attempt.passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning") : "bg-accent-soft text-accent-strong";
  const when = submitted ? t("quizzes.submittedAt", { date: formatDateTime(attempt.submitted_at) }) : t("quizzes.startedAt", { date: formatDateTime(attempt.started_at) });

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", tone)}>
          <ClipboardCheckIcon size={20} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-bold text-text-heading">{attempt.lesson.title}</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted">
            <span className="flex items-center gap-1 text-accent-strong">
              <BookOpenIcon size={12} />
              {attempt.subject.name} · {attempt.course.name}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon size={12} />
              <span dir="ltr">{when}</span>
            </span>
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
        <span className={cn("rounded-full px-3 py-1 text-xs font-bold", tone)} dir="ltr">
          {submitted && attempt.percent !== null ? t("quizzes.score", { score: attempt.score ?? 0, total: attempt.total ?? 0, percent: attempt.percent }) : t("quizzes.status.inProgress")}
        </span>
        <Button variant={submitted ? "secondary" : "primary"} size="sm" onClick={onOpen}>
          {submitted ? t("quizzes.viewResult") : t("quizzes.resume")}
        </Button>
      </div>
    </li>
  );
}
