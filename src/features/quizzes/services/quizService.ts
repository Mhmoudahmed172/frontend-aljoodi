import { apiProxy, isApiError } from "@/lib/api";
import type { MyQuizAttemptsFilters, MyQuizAttemptsPage, QuizAnswerInput, QuizAttemptResult, QuizLockedBy, QuizStartResponse, QuizSummary } from "../types/quiz.types";

/** Error codes the quiz endpoints can return besides the generic ones. */
export const QUIZ_ERROR_CODES = {
  locked: "QUIZ_LOCKED",
  alreadyAttempted: "QUIZ_ALREADY_ATTEMPTED",
  notAvailable: "QUIZ_NOT_AVAILABLE",
} as const;

/** `GET /user/v1/lessons/{lesson}/quiz` — 404 no quiz, 403 no access, 423 `QUIZ_LOCKED`. */
export function getLessonQuiz(lessonUuid: string): Promise<QuizSummary> {
  return apiProxy.get<QuizSummary>(`/user/v1/lessons/${lessonUuid}/quiz`);
}

/** `POST /user/v1/lessons/{lesson}/quiz/start` — 409 `QUIZ_ALREADY_ATTEMPTED` once submitted. */
export function startLessonQuiz(lessonUuid: string): Promise<QuizStartResponse> {
  return apiProxy.post<QuizStartResponse>(`/user/v1/lessons/${lessonUuid}/quiz/start`);
}

/** `POST /user/v1/attempts/{attempt}/submit` — unanswered questions count as wrong. */
export function submitQuizAttempt(attemptUuid: string, answers: QuizAnswerInput[]): Promise<QuizAttemptResult> {
  return apiProxy.post<QuizAttemptResult>(`/user/v1/attempts/${attemptUuid}/submit`, { answers });
}

/** `GET /user/v1/attempts/{attempt}` — the student's own submitted attempt with the review. */
export function getQuizAttempt(attemptUuid: string): Promise<QuizAttemptResult> {
  return apiProxy.get<QuizAttemptResult>(`/user/v1/attempts/${attemptUuid}`);
}

/** `GET /user/v1/quizzes/attempts` — every attempt of the signed-in student, paginated. */
export function getMyQuizAttempts(filters?: MyQuizAttemptsFilters): Promise<MyQuizAttemptsPage> {
  return apiProxy.get<MyQuizAttemptsPage>("/user/v1/quizzes/attempts", { params: filters });
}

/**
 * Reads `locked_by` off a 423 `QUIZ_LOCKED` error. The backend puts it in the envelope's `data`;
 * `data.errors.locked_by` is tolerated too so a change of nesting on the API side doesn't break the UI.
 */
export function lockedByFromError(error: unknown): QuizLockedBy | null {
  if (!isApiError(error) || (error.status !== 423 && error.code !== QUIZ_ERROR_CODES.locked)) return null;
  const candidates = [error.data, error.errors] as unknown[];
  for (const source of candidates) {
    const lockedBy = source && typeof source === "object" ? (source as { locked_by?: unknown }).locked_by : undefined;
    if (lockedBy && typeof lockedBy === "object" && typeof (lockedBy as QuizLockedBy).lesson_uuid === "string") {
      return lockedBy as QuizLockedBy;
    }
  }

  return { lesson_uuid: "", title: "" };
}
