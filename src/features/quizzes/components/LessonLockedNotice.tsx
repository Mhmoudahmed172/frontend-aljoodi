"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/Icons";
import type { QuizLockedBy } from "../types/quiz.types";

interface LessonLockedNoticeProps {
  lockedBy: QuizLockedBy | null;
  /** Opens the previous lesson's quiz directly; the button is hidden when absent. */
  onOpenQuiz?: (lesson: QuizLockedBy) => void;
  /** `inline` = one small line under a lesson row; `card` = a padded warning card; `overlay` = white text over the player poster. */
  variant?: "inline" | "card" | "overlay";
  className?: string;
}

/**
 * "Submit the previous lesson's quiz: {title}" notice with a lock icon and a button that opens that quiz.
 * Shown under a locked lesson row, inside the player when the embed answers 423, and inside the quiz modal itself.
 */
export function LessonLockedNotice({ lockedBy, onOpenQuiz, variant = "card", className }: LessonLockedNoticeProps) {
  const { t } = useT();
  const text = lockedBy?.title ? t("quizzes.lockedBy", { title: lockedBy.title }) : t("quizzes.lockedGeneric");
  const canOpen = Boolean(onOpenQuiz && lockedBy?.lesson_uuid);

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-warning", className)}>
        <span className="flex items-center gap-1 font-semibold">
          <LockIcon size={12} />
          {text}
        </span>
        {canOpen && (
          <button type="button" onClick={() => onOpenQuiz?.(lockedBy as QuizLockedBy)} className="font-bold text-primary hover:underline">
            {t("quizzes.openPreviousQuiz")}
          </button>
        )}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className={cn("flex flex-col items-center gap-3 text-center text-white", className)}>
        <LockIcon size={28} />
        <p className="text-sm font-bold">{t("quizzes.lockedTitle")}</p>
        <p className="text-xs">{text}</p>
        {canOpen && (
          <Button size="sm" onClick={() => onOpenQuiz?.(lockedBy as QuizLockedBy)}>
            {t("quizzes.openPreviousQuiz")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-2xl border border-warning-soft bg-warning-soft/60 px-5 py-8 text-center", className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-white text-warning shadow-soft">
        <LockIcon size={22} />
      </span>
      <p className="text-sm font-bold text-text-heading">{t("quizzes.lockedTitle")}</p>
      <p className="text-xs text-text-muted">{text}</p>
      {canOpen && (
        <Button size="sm" className="mt-1" onClick={() => onOpenQuiz?.(lockedBy as QuizLockedBy)}>
          {t("quizzes.openPreviousQuiz")}
        </Button>
      )}
    </div>
  );
}
