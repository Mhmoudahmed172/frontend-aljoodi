"use client";

import { useT } from "@/lib/i18n";
import { CoursesGrid } from "@/features/courses/components/CoursesGrid";
import type { CourseCard } from "@/features/courses/types/course.types";
import { useSubject } from "../hooks/useSubject";
import { pickCourse } from "../utils/teachers";

/**
 * "Other teachers' courses" suggestions under the public subject page: the subject's other courses (one per teacher)
 * as regular course cards, each linking to its own course. The page itself only presents the course in the link.
 * Loaded from `GET /api/v1/subjects/{slug}`.
 */
export function SubjectOtherCourses({ slug, courseSlug }: { slug: string; courseSlug?: string | null }) {
  const { t } = useT();
  const { subject, loading } = useSubject(slug);

  if (loading || !subject) {
    return null;
  }

  const current = pickCourse(subject, courseSlug);
  const others: CourseCard[] = subject.courses
    .filter((course) => course.uuid !== current?.uuid)
    .map((course) => ({
      uuid: course.uuid,
      name: course.name,
      slug: course.slug,
      cover_url: course.cover_url,
      branches: course.branches,
      subject: { uuid: subject.uuid, name: subject.name, slug: subject.slug },
      teacher: course.teachers?.[0] ?? null,
      teachers: course.teachers ?? [],
      prices: course.prices,
    }));

  if (others.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-black text-text-heading">{t("subjects.otherCoursesTitle", { subject: subject.name })}</h2>
      <CoursesGrid courses={others} />
    </section>
  );
}
