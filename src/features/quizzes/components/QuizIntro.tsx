"use client";

import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { ClipboardCheckIcon, LockIcon } from "@/components/ui/Icons";
import type { QuizSummary } from "../types/quiz.types";

interface QuizIntroProps {
  quiz: QuizSummary;
  lessonTitle: string;
  onStart: () => void;
  starting: boolean;
  error?: string | null;
}

/**
 * First screen of the quiz modal: title, optional instructions, "N questions · one attempt · pass mark X%",
 * a loud single-attempt warning and the start (or resume) button.
 */
export function QuizIntro({ quiz, lessonTitle, onStart, starting, error }: QuizIntroProps) {
  const { t } = useT();
  const resuming = quiz.attempt?.status === "in_progress";
  const meta = [t("quizzes.questionsCount", { count: quiz.questions_count }), t("quizzes.singleAttempt"), t("quizzes.passPercent", { percent: quiz.pass_percent })];

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
        <ClipboardCheckIcon size={30} />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-black text-text-heading">{quiz.title || t("quizzes.defaultTitle", { title: lessonTitle })}</h3>
        <p className="text-xs font-semibold text-text-muted">{meta.join(" · ")}</p>
        {quiz.is_required && (
          <span className="mx-auto mt-1 inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-0.5 text-[11px] font-bold text-accent-strong">
            <LockIcon size={11} />
            {t("quizzes.required")}
          </span>
        )}
      </div>
      {quiz.description && (
        <p className="max-w-md whitespace-pre-line text-sm leading-7 text-text" dir="auto">
          {quiz.description}
        </p>
      )}
      <div className="w-full rounded-2xl border border-warning-soft bg-warning-soft/60 px-4 py-3 text-xs font-bold text-warning">
        {resuming ? t("quizzes.inProgressHint") : t("quizzes.singleAttemptWarning")}
      </div>
      {error && <p className="text-xs font-semibold text-danger">{error}</p>}
      <Button size="lg" className="w-full sm:w-auto sm:min-w-56" onClick={onStart} loading={starting}>
        {resuming ? t("quizzes.resume") : t("quizzes.start")}
      </Button>
    </div>
  );
}
