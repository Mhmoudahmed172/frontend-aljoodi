import type { CoursePackage, SubjectDetail, SubjectTeacher } from "../types/subject.types";

/**
 * The course a subject page presents: the one whose slug is in the link (`?course=`), else the first one.
 * A subject can have one course per teacher, so the course card links to its own course.
 */
export function pickCourse(subject: SubjectDetail, courseSlug?: string | null): CoursePackage | undefined {
  return subject.courses.find((course) => course.slug === courseSlug) ?? subject.courses[0];
}

/** Teachers shown on the subject page: the presented course's own teachers (same list as its catalog card), else every teacher of the subject. */
export function subjectPageTeachers(subject: SubjectDetail, courseSlug?: string | null): SubjectTeacher[] {
  const courseTeachers = pickCourse(subject, courseSlug)?.teachers ?? [];

  return courseTeachers.length > 0 ? courseTeachers : subject.teachers;
}

/** Path of a subject page showing one of its courses. */
export function subjectCourseHref(subjectSlug: string, courseSlug?: string | null): string {
  return courseSlug ? `/subjects/${subjectSlug}?course=${encodeURIComponent(courseSlug)}` : `/subjects/${subjectSlug}`;
}
