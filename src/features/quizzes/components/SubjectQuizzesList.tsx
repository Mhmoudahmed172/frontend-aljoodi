"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ClipboardCheckIcon, LockIcon } from "@/components/ui/Icons";
import { useUnits } from "@/features/subjects/hooks/useSubject";
import type { LessonMini, Unit } from "@/features/subjects/types/subject.types";
import { quizActionKey } from "./LessonQuizBadge";
import { QuizModal, type QuizLessonRef } from "./QuizModal";

interface SubjectQuizzesListProps {
  slug: string;
  className?: string;
  /** Slug of the subject's course to list; the first course when omitted. */
  course?: string | null;
}

/**
 * "Quizzes" tab of the dashboard subject page: every lesson of the subject that carries a quiz, with its status
 * (not started / in progress / submitted with the score) and the start / resume / view-result action.
 */
export function SubjectQuizzesList({ slug, className, course }: SubjectQuizzesListProps) {
  const { t } = useT();
  const { units, loading } = useUnits(slug, course);
  const [quizLesson, setQuizLesson] = useState<QuizLessonRef | null>(null);
  const rows = units.flatMap((unit) => unit.lessons.filter((lesson) => lesson.quiz).map((lesson) => ({ unit, lesson })));

  if (loading) {
    return <div className={cn("h-16 animate-pulse rounded-xl bg-surface", className)} />;
  }

  if (rows.length === 0) {
    return (
      <div className={cn("flex flex-col items-center gap-2 rounded-xl bg-primary-faint px-5 py-6 text-center", className)}>
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <ClipboardCheckIcon size={18} />
        </span>
        <p className="text-xs font-bold text-text-heading">{t("quizzes.subjectQuizzesEmpty")}</p>
      </div>
    );
  }

  return (
    <>
      <ul className={cn("divide-y divide-border", className)}>
        {rows.map(({ unit, lesson }) => (
          <QuizRow key={lesson.uuid} unit={unit} lesson={lesson} onOpen={() => setQuizLesson({ uuid: lesson.uuid, title: lesson.title })} />
        ))}
      </ul>
      <QuizModal slug={slug} course={course} lesson={quizLesson} onClose={() => setQuizLesson(null)} />
    </>
  );
}

function QuizRow({ unit, lesson, onOpen }: { unit: Unit; lesson: LessonMini; onOpen: () => void }) {
  const { t } = useT();
  const quiz = lesson.quiz!;
  const submitted = quiz.attempt_status === "submitted";
  const status = submitted ? t("quizzes.status.submitted") : quiz.attempt_status === "in_progress" ? t("quizzes.status.inProgress") : t("quizzes.status.notStarted");
  const statusTone = submitted ? (quiz.passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning") : quiz.attempt_status === "in_progress" ? "bg-accent-soft text-accent-strong" : "bg-surface text-text-muted";
  const locked = Boolean(lesson.locked_by_quiz);

  return (
    <li className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", submitted ? (quiz.passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning") : "bg-primary-subtle text-primary")}>
          {locked ? <LockIcon size={18} /> : <ClipboardCheckIcon size={18} />}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-xs font-bold text-text-heading">{lesson.title}</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-text-muted">
            <span>
              <span className="font-semibold text-primary">{String(unit.number).padStart(2, "0")}</span> {unit.title}
            </span>
            <span>{t("quizzes.questionsCount", { count: quiz.questions_count })}</span>
            {quiz.is_required && <span className="font-semibold text-accent-strong">{t("quizzes.required")}</span>}
            <span className={cn("rounded-full px-2 py-0.5 font-semibold", statusTone)}>
              {status}
              {submitted && quiz.percent !== null ? ` · ${t("quizzes.percent", { value: quiz.percent })}` : ""}
            </span>
          </span>
          {locked && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-warning">
              <LockIcon size={10} />
              {t("quizzes.lockedBy", { title: lesson.locked_by_quiz?.title ?? "" })}
            </span>
          )}
        </div>
      </div>
      <Button variant={submitted ? "secondary" : "primary"} size="sm" onClick={onOpen} className="shrink-0 self-start sm:self-auto">
        {t(quizActionKey(quiz))}
      </Button>
    </li>
  );
}
