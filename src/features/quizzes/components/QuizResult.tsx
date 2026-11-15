"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CheckCircleSolidIcon, CloseIcon, LockIcon } from "@/components/ui/Icons";
import type { QuizAttemptResult, QuizNextLesson } from "../types/quiz.types";

interface QuizResultProps {
  result: QuizAttemptResult;
  /** Opens the next lesson in the player; when absent the button links to `nextLessonHref` instead. */
  onNextLesson?: (lesson: QuizNextLesson) => void;
  nextLessonHref?: string;
}

/** Big score "4/5 · 80%", pass/fail badge, then a per-question review (your answer, correct answer, explanation). */
export function QuizResult({ result, onNextLesson, nextLessonHref }: QuizResultProps) {
  const { t } = useT();
  const passed = result.passed;
  const next = result.next_lesson;

  return (
    <div className="flex flex-col gap-6">
      <div className={cn("flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center", passed ? "bg-success-soft" : "bg-warning-soft")}>
        <p className="text-xs font-bold text-text-muted">{t("quizzes.resultTitle")}</p>
        <p className={cn("text-3xl font-black", passed ? "text-success" : "text-warning")} dir="ltr">
          {t("quizzes.score", { score: result.score, total: result.total, percent: result.percent })}
        </p>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white", passed ? "bg-success" : "bg-warning")}>
          {passed ? <CheckCircleSolidIcon size={14} /> : <CloseIcon size={14} />}
          {passed ? t("quizzes.passed") : t("quizzes.failed")}
        </span>
        <p className="text-[11px] text-text-muted">{t("quizzes.passHint", { percent: result.pass_percent })}</p>
      </div>

      {next && (
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          {next.unlocked ? (
            onNextLesson ? (
              <Button size="md" onClick={() => onNextLesson(next)} className="w-full sm:w-auto">
                {t("quizzes.nextLesson", { title: next.title })}
              </Button>
            ) : nextLessonHref ? (
              <Link href={nextLessonHref} className="w-full sm:w-auto">
                <Button size="md" className="w-full">
                  {t("quizzes.nextLesson", { title: next.title })}
                </Button>
              </Link>
            ) : null
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-text-muted">
              <LockIcon size={12} />
              {t("quizzes.nextLessonLocked")}
            </span>
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-bold text-text-heading">{t("quizzes.review")}</h4>
        <ol className="mt-3 flex flex-col gap-3">
          {result.answers.map((answer, i) => (
            <li key={answer.question_uuid} className={cn("rounded-2xl border p-4", answer.is_correct ? "border-success-soft bg-success-soft/40" : "border-danger-soft bg-danger-soft/40")}>
              <div className="flex items-start gap-3">
                <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-white", answer.is_correct ? "bg-success" : "bg-danger")}>
                  {answer.is_correct ? <CheckCircleSolidIcon size={14} /> : <CloseIcon size={12} />}
                </span>
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="text-sm font-bold leading-7 text-text-heading" dir="auto">
                    {i + 1}. {answer.question_text}
                  </p>
                  <p className="text-xs text-text">
                    <span className="font-bold text-text-muted">{t("quizzes.yourAnswer")}</span>{" "}
                    <span className={cn("font-semibold", answer.is_correct ? "text-success" : "text-danger")} dir="auto">
                      {answer.option_text ?? t("quizzes.noAnswer")}
                    </span>
                  </p>
                  {!answer.is_correct && (
                    <p className="text-xs text-text">
                      <span className="font-bold text-text-muted">{t("quizzes.correctAnswer")}</span>{" "}
                      <span className="font-semibold text-success" dir="auto">
                        {answer.correct_option_text}
                      </span>
                    </p>
                  )}
                  {answer.explanation && (
                    <p className="rounded-xl bg-white/70 px-3 py-2 text-xs leading-6 text-text-muted" dir="auto">
                      <span className="font-bold">{t("quizzes.explanation")}</span> {answer.explanation}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
