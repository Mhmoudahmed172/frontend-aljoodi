"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Logo } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrices } from "@/features/courses/utils/prices";
import { subjectCourseHref } from "@/features/subjects/utils/teachers";
import type { TeacherDetail } from "../types/teacher.types";

/**
 * "Subjects by this teacher" (Figma UI-41): cyan-glow title with a yellow spark, subtitle, dashed arrow pointing down, then course cards with
 * thumbnail, subject tags, title, original/discounted price and a subscribe CTA. Backed by the teacher
 * detail's `courses`; each CTA opens that course itself (`/subjects/{subject}?course={course}`) — a subject can have
 * one course per teacher, so the subject page alone would show another teacher's course.
 */
export function TeacherSubjects({ teacher }: { teacher: TeacherDetail }) {
  const { t } = useT();
  const courses = teacher.courses.slice(0, 3);
  const courseHref = (course: TeacherDetail["courses"][number]) => {
    const subjectSlug = course.subject?.slug ?? teacher.subjects[0]?.slug;

    return subjectSlug ? subjectCourseHref(subjectSlug, course.slug) : "/subjects";
  };

  return (
    <section className="relative">
      {/* Dashed arrow pointing DOWN towards the course cards (Figma UI-41). */}
      <Image src="/images/decor-arrow-dashed.png" alt="" width={64} height={80} className="pointer-events-none absolute start-1/4 top-0 hidden w-14 opacity-70 md:block" />
      <SectionHeading before={t("teachers.subjectsTitle1")} highlight={t("teachers.subjectsHighlight")} subtitle={t("teachers.subjectsSubtitle")} highlightClassName="marker-cyan" sparkle />
      {courses.length === 0 ? (
        <div className="mt-8">
          <ErrorState title={t("teachers.noCoursesTitle")} message={t("teachers.noCoursesText")} />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {courses.map((course) => {
            const { current, original } = formatPrices(course.prices);
            return (
              <div key={course.uuid} className="flex flex-col rounded-2xl border border-border bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <Logo width={56} href="" />
                </div>
                <div className="relative mt-2 h-40 overflow-hidden rounded-xl bg-primary-faint">
                  <Image src={course.cover_url ?? "/images/course-thumb.png"} alt={course.name} fill className="object-cover" sizes="360px" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {teacher.subjects.slice(0, 2).map((s) => (
                    <span key={s.uuid} className="rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {s.name}
                    </span>
                  ))}
                  <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-text-muted">{t("common.tawjihi")}</span>
                </div>
                <p className="mt-3 text-sm font-bold leading-6 text-text-heading">{course.name}</p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-baseline gap-2">
                    {original && (
                      <span className="text-xs text-text-muted line-through">
                        {original} {t("common.currency")}
                      </span>
                    )}
                    {current && (
                      <span className="text-base font-bold text-primary">
                        {current} {t("common.currency")}
                      </span>
                    )}
                  </div>
                  <Link href={courseHref(course)}>
                    <Button className="h-10 px-6 text-xs">{t("common.subscribeNow")}</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
