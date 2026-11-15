/** `GET /user/v1/dashboard/summary` — home stat cards. */
export interface DashboardSummary {
  active_subscriptions_count: number;
  completed_lessons_count: number;
  wallet_balance: number;
}

/** `CoursePackageResource` embedded in a continue-learning item. */
export interface ContinueLearningCourse {
  uuid: string;
  name: string;
  slug: string;
  cover_url: string | null;
  outcomes: string[];
  /** Keyed by `SubscriptionScopeEnum` value; a null price means that scope isn't offered. */
  prices: {
    first: string | null;
    second: string | null;
    both: string | null;
  };
}

/** Subject summary embedded in a continue-learning item. */
export interface ContinueLearningSubject {
  uuid: string;
  name: string;
  slug: string;
}

/** `GET /user/v1/dashboard/continue-learning` item (up to 5). */
export interface ContinueLearningItem {
  uuid: string;
  scope: "first" | "second" | "both";
  status: string;
  expires_at: string | null;
  course: ContinueLearningCourse;
  subject: ContinueLearningSubject;
}

export type MySubjectSubscriptionStatus = "active" | "pending" | "expired" | "cancelled";

/** `GET /user/v1/subjects` and `GET /user/v1/subjects/{uuid}` — the student's own subscribed subjects. */
export interface MySubject {
  uuid: string;
  name: string;
  slug: string;
  icon_url: string | null;
  teachers_count: number;
  progress: number;
  subscription_status: MySubjectSubscriptionStatus;
  subscription_expires_at: string | null;
  /** The subscribed course (a subject can have one course per teacher). */
  course_uuid?: string | null;
  course_slug?: string | null;
}
