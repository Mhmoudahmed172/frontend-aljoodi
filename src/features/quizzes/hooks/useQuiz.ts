"use client";

import { useQuery } from "@tanstack/react-query";
import { apiProxy, toApiError, type ApiError } from "@/lib/api";
import { useApiMutation, useApiQuery } from "@/lib/api/hooks";
import { getLessonQuiz, getQuizAttempt, startLessonQuiz, submitQuizAttempt } from "../services/quizService";
import type { MyQuizAttemptsFilters, MyQuizAttemptsPage, QuizAnswerInput, QuizAttemptResult, QuizStartResponse, QuizSummary } from "../types/quiz.types";

/** Query-key prefixes invalidated after a submit: the quiz itself, the attempts list, curriculum rows and dashboard progress. */
export const QUIZ_KEYS = {
  all: ["quizzes"] as const,
  lesson: (lessonUuid: string) => ["quizzes", "lesson", lessonUuid] as const,
  attempt: (attemptUuid: string) => ["quizzes", "attempt", attemptUuid] as const,
  myAttempts: ["quizzes", "my-attempts"] as const,
};

/** `GET /user/v1/lessons/{lesson}/quiz` — summary shown on the intro screen; errors (404/403/423) surface as `ApiError`. */
export function useLessonQuiz(lessonUuid: string | null, enabled = true) {
  const query = useQuery<QuizSummary, ApiError>({
    queryKey: QUIZ_KEYS.lesson(lessonUuid ?? ""),
    queryFn: async () => {
      try {
        return await getLessonQuiz(lessonUuid as string);
      } catch (e) {
        throw toApiError(e);
      }
    },
    enabled: Boolean(lessonUuid) && enabled,
    retry: false,
    staleTime: 0,
  });

  return { quiz: query.data ?? null, loading: query.isLoading, error: query.error ?? null, refetch: query.refetch };
}

/** `GET /user/v1/attempts/{attempt}` — the submitted attempt with per-question review. */
export function useQuizAttempt(attemptUuid: string | null, enabled = true) {
  const query = useQuery<QuizAttemptResult, ApiError>({
    queryKey: QUIZ_KEYS.attempt(attemptUuid ?? ""),
    queryFn: async () => {
      try {
        return await getQuizAttempt(attemptUuid as string);
      } catch (e) {
        throw toApiError(e);
      }
    },
    enabled: Boolean(attemptUuid) && enabled,
    retry: false,
  });

  return { result: query.data ?? null, loading: query.isLoading, error: query.error ?? null };
}

/** `POST /user/v1/lessons/{lesson}/quiz/start` — no toast; the modal renders the returned questions. */
export function useStartQuiz() {
  return useApiMutation<string, QuizStartResponse>((lessonUuid) => startLessonQuiz(lessonUuid), {
    successMessage: false,
    errorMessage: false,
  });
}

/** `POST /user/v1/attempts/{attempt}/submit` — refreshes curriculum rows, the attempts list and dashboard progress. */
export function useSubmitQuiz(lessonUuid: string | null) {
  return useApiMutation<{ attemptUuid: string; answers: QuizAnswerInput[] }, QuizAttemptResult>(
    ({ attemptUuid, answers }) => submitQuizAttempt(attemptUuid, answers),
    {
      successMessage: false,
      invalidate: [[...QUIZ_KEYS.all], ["subjects", "units"], ["dashboard"], ...(lessonUuid ? [[...QUIZ_KEYS.lesson(lessonUuid)]] : [])],
    },
  );
}

/** `GET /user/v1/quizzes/attempts` — the signed-in student's attempts for the "my exams" page. */
export function useMyQuizAttempts(filters?: MyQuizAttemptsFilters) {
  const { data, isLoading, error } = useApiQuery<MyQuizAttemptsPage>(
    [...QUIZ_KEYS.myAttempts],
    "/user/v1/quizzes/attempts",
    filters as Record<string, unknown> | undefined,
    { retry: false },
    apiProxy,
  );

  return { attempts: data?.items ?? [], meta: data?.meta, loading: isLoading, error };
}
