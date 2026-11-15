/** Teacher summary embedded in a course card. */
export interface CourseTeacher {
  uuid: string;
  name: string;
  photo_url: string | null;
}

/** Subject summary embedded in a course card. */
export interface CourseSubject {
  uuid: string;
  name: string;
  slug: string;
}

/** `CourseCardResource` — public course catalog item (`GET /api/v1/courses`). */
export interface CourseCard {
  uuid: string;
  name: string;
  slug: string;
  cover_url: string | null;
  /** Secondary-school branches this course targets (e.g. `"scientific"`); empty means all branches. */
  branches: string[];
  subject: CourseSubject;
  /** First teacher only — kept for older API builds; prefer `teachers`. */
  teacher: CourseTeacher | null;
  /** Every visible teacher of the course, in display order. */
  teachers?: CourseTeacher[];
  /** Keyed by `SubscriptionScopeEnum` value; a null price means that scope isn't offered. */
  prices: {
    first: string | null;
    second: string | null;
    both: string | null;
  };
}
