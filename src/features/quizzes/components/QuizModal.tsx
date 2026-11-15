"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@/lib/i18n";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LockIcon } from "@/components/ui/Icons";
import { subjectCourseHref } from "@/features/subjects/utils/teachers";
import { QUIZ_KEYS, useLessonQuiz, useQuizAttempt, useStartQuiz, useSubmitQuiz } from "../hooks/useQuiz";
import { QUIZ_ERROR_CODES, lockedByFromError } from "../services/quizService";
import { LessonLockedNotice } from "./LessonLockedNotice";
import { QuizIntro } from "./QuizIntro";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizResult } from "./QuizResult";
import type { QuizAnswerInput, QuizAttemptResult, QuizLockedBy, QuizNextLesson, QuizQuestion } from "../types/quiz.types";

export interface QuizLessonRef {
  uuid: string;
  title: string;
}

interface QuizModalProps {
  /** Subject slug — used for the "subscribe" link on 403 and the fallback "next lesson" link. */
  slug: string;
  /** Slug of the subject's course the lesson belongs to — kept on the "subscribe" link. */
  course?: string | null;
  lesson: QuizLessonRef | null;
  onClose: () => void;
  /** Opens a lesson in the player (result screen "next lesson" button); falls back to a link to the subject page. */
  onOpenLesson?: (lesson: QuizNextLesson) => void;
}

/**
 * The student quiz flow in one modal: intro (summary from `GET lessons/{uuid}/quiz`) → one question per screen →
 * confirm → result with review. Answers live in component state only; closing the modal keeps the `in_progress`
 * attempt server-side and reopening (`start` again) returns the same questions. A 423 on the summary shows the
 * "submit the previous lesson's quiz" notice whose button retargets the modal to that lesson.
 */
export function QuizModal({ slug, course, lesson, onClose, onOpenLesson }: QuizModalProps) {
  // The locked notice can retarget the modal to the previous lesson; `lesson` stays the caller's original request.
  const [override, setOverride] = useState<{ for: string; target: QuizLessonRef } | null>(null);
  const target = lesson && override?.for === lesson.uuid ? override.target : lesson;

  const close = () => {
    setOverride(null);
    onClose();
  };

  return (
    <Modal open={Boolean(lesson)} onClose={close} className="max-w-2xl p-5 md:p-7">
      {lesson && target && (
        <QuizModalBody
          key={target.uuid}
          slug={slug}
          course={course}
          lesson={target}
          onClose={close}
          onOpenLesson={onOpenLesson}
          onSwitchLesson={(locked) => setOverride({ for: lesson.uuid, target: { uuid: locked.lesson_uuid, title: locked.title } })}
        />
      )}
    </Modal>
  );
}

type Phase = "intro" | "questions" | "confirm";

interface BodyProps {
  slug: string;
  course?: string | null;
  lesson: QuizLessonRef;
  onClose: () => void;
  onOpenLesson?: (lesson: QuizNextLesson) => void;
  onSwitchLesson: (locked: QuizLockedBy) => void;
}

function QuizModalBody({ slug, course, lesson, onClose, onOpenLesson, onSwitchLesson }: BodyProps) {
  const { t } = useT();
  const queryClient = useQueryClient();
  const { quiz, loading, error, refetch } = useLessonQuiz(lesson.uuid);

  const [phase, setPhase] = useState<Phase>("intro");
  const [attemptUuid, setAttemptUuid] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const start = useStartQuiz();
  const submit = useSubmitQuiz(lesson.uuid);

  const submittedAttemptUuid = !result && quiz?.attempt?.status === "submitted" ? quiz.attempt.uuid : null;
  const { result: storedResult, loading: resultLoading, error: resultError } = useQuizAttempt(submittedAttemptUuid);
  const shownResult = result ?? storedResult;

  const handleStart = () => {
    setStartError(null);
    start.mutate(lesson.uuid, {
      onSuccess: (data) => {
        setAttemptUuid(data.attempt.uuid);
        setQuestions(data.questions);
        setAnswers({});
        setIndex(0);
        setPhase("questions");
      },
      onError: (err) => {
        if (err.status === 409 || err.code === QUIZ_ERROR_CODES.alreadyAttempted) {
          void queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.lesson(lesson.uuid) });
          void refetch();

          return;
        }
        setStartError(err.message || t("quizzes.loadError"));
      },
    });
  };

  const handleSubmit = () => {
    if (!attemptUuid) return;
    const payload: QuizAnswerInput[] = questions.map((q) => ({ question: q.uuid, option: answers[q.uuid] ?? null }));
    submit.mutate(
      { attemptUuid, answers: payload },
      {
        onSuccess: (data) => {
          setResult(data);
          setPhase("intro");
        },
      },
    );
  };

  const headerTitle = quiz?.title || t("quizzes.defaultTitle", { title: lesson.title });

  let body: ReactNode;

  if (error) {
    const lockedBy = lockedByFromError(error);
    if (lockedBy) {
      body = <LessonLockedNotice lockedBy={lockedBy} onOpenQuiz={onSwitchLesson} />;
    } else if (error.status === 403) {
      body = (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface px-5 py-8 text-center">
          <LockIcon size={28} className="text-text-muted" />
          <p className="text-sm font-bold text-text-heading">{t("quizzes.forbidden")}</p>
          <Link href={`${subjectCourseHref(slug, course)}#subscribe`} onClick={onClose}>
            <Button size="sm">{t("common.subscribePackage")}</Button>
          </Link>
        </div>
      );
    } else if (error.status === 404) {
      body = <ErrorState title={t("quizzes.noQuiz")} message="" />;
    } else {
      body = <ErrorState title={t("quizzes.loadError")} message={error.message} onRetry={() => void refetch()} />;
    }
  } else if (loading || !quiz || (submittedAttemptUuid && resultLoading)) {
    body = <p className="py-10 text-center text-sm font-semibold text-text-muted">{t("quizzes.loading")}</p>;
  } else if (shownResult) {
    body = <QuizResult result={shownResult} onNextLesson={onOpenLesson} nextLessonHref={`/dashboard/subjects/${slug}`} />;
  } else if (submittedAttemptUuid && resultError) {
    body = <ErrorState title={t("quizzes.loadError")} message={resultError.message} />;
  } else if (phase === "questions" && questions.length > 0) {
    const question = questions[index];
    body = (
      <QuizQuestionCard
        question={question}
        index={index}
        total={questions.length}
        answered={Object.keys(answers).length}
        selected={answers[question.uuid] ?? null}
        onSelect={(optionUuid) => setAnswers((prev) => ({ ...prev, [question.uuid]: optionUuid }))}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
        onSubmit={() => setPhase("confirm")}
      />
    );
  } else if (phase === "confirm") {
    const unanswered = questions.filter((q) => !answers[q.uuid]).length;
    body = (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <p className="text-base font-black text-text-heading">{t("quizzes.confirmSubmitTitle")}</p>
        <p className={unanswered > 0 ? "text-sm font-semibold text-warning" : "text-sm text-text-muted"}>
          {unanswered > 0 ? t("quizzes.confirmSubmitUnanswered", { count: unanswered }) : t("quizzes.confirmSubmitAll")}
        </p>
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
          <Button variant="outline" onClick={() => setPhase("questions")} disabled={submit.isPending}>
            {t("quizzes.backToQuestions")}
          </Button>
          <Button onClick={handleSubmit} loading={submit.isPending}>
            {submit.isPending ? t("quizzes.submitting") : t("quizzes.confirmSubmit")}
          </Button>
        </div>
      </div>
    );
  } else {
    body = <QuizIntro quiz={quiz} lessonTitle={lesson.title} onStart={handleStart} starting={start.isPending} error={startError} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="pe-10">
        <p className="text-[11px] font-semibold text-text-muted">{lesson.title}</p>
        <h3 className="text-base font-bold text-text-heading">{headerTitle}</h3>
      </div>
      {body}
    </div>
  );
}
