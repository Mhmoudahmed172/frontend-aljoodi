"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import type { QuizQuestion } from "../types/quiz.types";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  total: number;
  answered: number;
  selected: string | null;
  onSelect: (optionUuid: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

/**
 * One question per screen: "3 / 5" counter with a progress bar, the question text, four large selectable option
 * cards (an implicit radio group) and prev/next — the last screen swaps "next" for "submit answers".
 */
export function QuizQuestionCard({ question, index, total, answered, selected, onSelect, onPrev, onNext, onSubmit }: QuizQuestionCardProps) {
  const { t } = useT();
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const progress = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;
  const letters = ["أ", "ب", "ج", "د", "هـ", "و"];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
          <span dir="ltr">{t("quizzes.questionOf", { current: index + 1, total })}</span>
          <span>
            {answered}/{total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="text-base font-bold leading-8 text-text-heading" dir="auto">
        {question.text}
      </p>

      <div role="radiogroup" aria-label={question.text} className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, i) => {
          const active = selected === option.uuid;
          return (
            <button
              key={option.uuid}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(option.uuid)}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-start text-sm font-semibold transition",
                active ? "border-primary bg-primary-subtle text-primary shadow-soft" : "border-border bg-white text-text hover:border-primary-soft hover:bg-primary-faint",
              )}
            >
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black", active ? "bg-primary text-white" : "bg-surface text-text-muted")}>
                {active ? <CheckIcon size={14} /> : (letters[i] ?? i + 1)}
              </span>
              <span dir="auto">{option.text}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Button variant="outline" size="md" onClick={onPrev} disabled={isFirst} className="px-5">
          {t("quizzes.prev")}
        </Button>
        {isLast ? (
          <Button size="md" onClick={onSubmit} className="px-6">
            {t("quizzes.submit")}
          </Button>
        ) : (
          <Button size="md" onClick={onNext} className="px-6">
            {t("quizzes.next")}
          </Button>
        )}
      </div>
    </div>
  );
}
