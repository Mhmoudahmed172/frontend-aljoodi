/** `SubjectResource` — public catalog list item (`GET /api/v1/subjects`). */
export interface Subject {
  uuid: string;
  name: string;
  slug: string;
  icon_url: string | null;
  teachers_count: number;
  /**
   * "My subjects" fields — not returned by the public catalog endpoints.
   * Sourced from a future `GET /user/subjects` pass; only render when present.
   */
  progress?: number;
  status?: "inProgress" | "completed";
}

/** Teacher summary embedded in `SubjectDetail.teachers`. */
export interface SubjectTeacher {
  uuid: string;
  name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
}

/** `CoursePackageResource` — a subscribable course under a subject. */
export interface CoursePackage {
  uuid: string;
  name: string;
  slug: string;
  /** The course's own subject (teacher page only), so the course links to itself. */
  subject?: { uuid: string; name: string; slug: string } | null;
  cover_url: string | null;
  description: string | null;
  /** `BranchEnum` values the course targets (empty = every branch). */
  branches: string[];
  outcomes: string[];
  /** Visible teachers of this course, in display order (only on the subject detail endpoint). */
  teachers?: SubjectTeacher[];
  /** Region the `prices` below were resolved for (`west_bank` | `gaza`). */
  price_region?: "west_bank" | "gaza";
  /** Keyed by `SubscriptionScopeEnum` value; a null price means that scope isn't offered. */
  prices: {
    first: string | null;
    second: string | null;
    both: string | null;
  };
}

/** `SubjectDetailResource` — `GET /api/v1/subjects/{slug}`. */
export interface SubjectDetail extends Subject {
  courses: CoursePackage[];
  teachers: SubjectTeacher[];
}

/** A lesson file as exposed by `LessonMiniResource`; `url` is null while the lesson is locked for the visitor. */
export interface LessonFile {
  uuid: string;
  name: string;
  type: string | null;
  size: number | null;
  url: string | null;
}

/** `CourseFileResource` — a course-level material (`GET /user/v1/subjects/{uuid}/files`, active subscribers only). */
export interface CourseFile extends LessonFile {
  created_at: string | null;
}

/** Quiz summary embedded in `LessonMini.quiz` (null when the lesson has no enabled quiz). */
export interface LessonQuizSummary {
  uuid: string;
  questions_count: number;
  is_required: boolean;
  /** Only computed for the signed-in student; guests always get null. */
  attempt_status: "in_progress" | "submitted" | null;
  percent: number | null;
  passed: boolean | null;
}

/** The previous lesson whose required quiz must be submitted before this lesson opens. */
export interface LessonLockedBy {
  lesson_uuid: string;
  title: string;
}

/** `LessonMiniResource` — title/duration plus the files list (URLs only when free / accessible). */
export interface LessonMini {
  uuid: string;
  title: string;
  duration_seconds: number;
  duration: string;
  is_free: boolean;
  /** True when the lesson has a (finished or processing) video; the video id itself is never exposed. */
  has_video: boolean;
  /** Lesson cover or video thumbnail, shown as the row thumbnail and the player poster. */
  cover_url: string | null;
  /** True when the visitor may open the lesson files (free lesson, or a signed-in student with access). */
  is_unlocked: boolean;
  files_count: number;
  files: LessonFile[];
  quiz: LessonQuizSummary | null;
  locked_by_quiz: LessonLockedBy | null;
}

/** `UnitResource` — `GET /api/v1/subjects/{slug}/units` item. */
export interface Unit {
  uuid: string;
  number: number;
  title: string;
  semester: string | null;
  lessons: LessonMini[];
}

/** How the player found the lesson video watermark tampered with — `WatermarkTamperReasonEnum` on the backend. */
export type WatermarkTamperReason = "removed" | "text_changed" | "hidden" | "moved" | "covered" | "devtools";
