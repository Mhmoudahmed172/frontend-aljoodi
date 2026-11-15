import type { Paginated } from "@/types/api/common";

export type QuizAttemptStatus = "in_progress" | "submitted";

/** `attempt` embedded in the quiz summary (`GET /user/v1/lessons/{lesson}/quiz`). */
export interface QuizAttemptSummary {
  uuid: string;
  status: QuizAttemptStatus;
  score: number | null;
  total: number | null;
  percent: number | null;
  passed: boolean | null;
  submitted_at: string | null;
}

/** `GET /user/v1/lessons/{lesson}/quiz` — what the student sees before starting. */
export interface QuizSummary {
  uuid: string;
  title: string;
  description: string | null;
  questions_count: number;
  is_required: boolean;
  pass_percent: number;
  attempt: QuizAttemptSummary | null;
}

export interface QuizOption {
  uuid: string;
  text: string;
}

/** A question as served to the student while the attempt is in progress — never carries `is_correct`. */
export interface QuizQuestion {
  uuid: string;
  text: string;
  options: QuizOption[];
}

/** `POST /user/v1/lessons/{lesson}/quiz/start` — creates the attempt or returns the running one with the same questions. */
export interface QuizStartResponse {
  attempt: {
    uuid: string;
    status: QuizAttemptStatus;
    started_at: string;
  };
  questions: QuizQuestion[];
}

/** One answer in the submit payload; `option` is null when the student left the question blank. */
export interface QuizAnswerInput {
  question: string;
  option: string | null;
}

/** Per-question review row in the attempt result. */
export interface QuizAnswerResult {
  question_uuid: string;
  question_text: string;
  option_text: string | null;
  correct_option_text: string;
  is_correct: boolean;
  explanation: string | null;
}

/** The lesson that follows the quiz's lesson in the curriculum, if any. */
export interface QuizNextLesson {
  uuid: string;
  title: string;
  unlocked: boolean;
}

/** `POST /user/v1/attempts/{attempt}/submit` and `GET /user/v1/attempts/{attempt}`. */
export interface QuizAttemptResult {
  uuid: string;
  status: "submitted";
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  pass_percent: number;
  submitted_at: string | null;
  answers: QuizAnswerResult[];
  next_lesson: QuizNextLesson | null;
}

/** `GET /user/v1/quizzes/attempts` row — the student's attempt with its lesson/course/subject context. */
export interface MyQuizAttempt {
  uuid: string;
  status: QuizAttemptStatus;
  score: number | null;
  total: number | null;
  percent: number | null;
  passed: boolean | null;
  submitted_at: string | null;
  started_at: string;
  lesson: { uuid: string; title: string };
  course: { uuid: string; name: string };
  subject: { uuid: string; name: string; slug: string };
}

export type MyQuizAttemptsPage = Paginated<MyQuizAttempt>;

export interface MyQuizAttemptsFilters {
  page?: number;
  per_page?: number;
  status?: QuizAttemptStatus;
}

/** `data.locked_by` returned with a 423 `QUIZ_LOCKED` error. */
export interface QuizLockedBy {
  lesson_uuid: string;
  title: string;
}
