import type { Attachment } from "@/types/api/common";
import type { CoursePackage } from "@/features/subjects/types/subject.types";

/** Subject embedded in `Teacher.subjects`. */
export interface TeacherSubject {
  uuid: string;
  name: string;
  slug: string;
}

/** Aggregate stats shown on teacher cards/hero. */
export interface TeacherStats {
  students_count: number;
  lessons_count: number;
  ratings_avg: string;
  ratings_count: number;
}

/** `TeacherResource` — public catalog list item (`GET /api/v1/teachers`). */
export interface Teacher {
  uuid: string;
  name: string | null;
  title: string | null;
  subtitle: string | null;
  photo_url: string | null;
  subjects: TeacherSubject[];
  stats: TeacherStats;
  /**
   * The signed-in student's fields — only returned when the request is authenticated (through `apiProxy`).
   * `subscribed` is true while a course of the teacher is actively subscribed; `subscription_status` is `pending`
   * while a subscription awaits activation; `progress` (0-100) covers the actively subscribed courses.
   */
  subscribed?: boolean;
  subscription_status?: "active" | "pending" | null;
  progress?: number;
}

/** `TeacherDetailResource` — `GET /api/v1/teachers/{uuid}`. */
export interface TeacherDetail extends Teacher {
  bio: string | null;
  features: string[];
  gallery: Attachment[];
  courses: CoursePackage[];
}
