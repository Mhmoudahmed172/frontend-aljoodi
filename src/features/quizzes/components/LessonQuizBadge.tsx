"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ClipboardCheckIcon } from "@/components/ui/Icons";
import type { LessonQuizSummary } from "@/features/subjects/types/subject.types";

interface LessonQuizBadgeProps {
  quiz: LessonQuizSummary;
  /** Guests see the badge only; the action routes them to `/login`. */
  authenticated: boolean;
  onOpen: () => void;
  className?: string;
}

/** Returns the i18n key of the row action for a quiz summary: start / resume / view result. */
export function quizActionKey(quiz: LessonQuizSummary): "quizzes.start" | "quizzes.resume" | "quizzes.viewResult" {
  if (quiz.attempt_status === "submitted") return "quizzes.viewResult";
  if (quiz.attempt_status === "in_progress") return "quizzes.resume";

  return "quizzes.start";
}

/**
 * Lesson-row quiz badge ("quiz", or "quiz · 80%" in success/warning after submission) followed by the
 * start / resume / view-result action. Meant for the compact 11px meta line under a lesson title.
 */
export function LessonQuizBadge({ quiz, authenticated, onOpen, className }: LessonQuizBadgeProps) {
  const { t } = useT();
  const submitted = quiz.attempt_status === "submitted" && quiz.percent !== null;
  const tone = submitted ? (quiz.passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning") : "bg-primary-subtle text-primary";

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold", tone)}>
        <ClipboardCheckIcon size={11} />
        {submitted ? t("quizzes.badgeScore", { percent: quiz.percent as number }) : t("quizzes.badge")}
      </span>
      {authenticated ? (
        <button type="button" onClick={onOpen} className="font-bold text-primary hover:underline">
          {t(quizActionKey(quiz))}
        </button>
      ) : (
        <Link href="/login" className="font-bold text-primary hover:underline">
          {t("quizzes.start")}
        </Link>
      )}
    </span>
  );
}
