"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CoursesGrid } from "@/features/courses/components/CoursesGrid";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { ErrorState } from "@/components/ui/ErrorState";
import { PaperPlaneIcon, TriangleIcon } from "@/components/ui/Icons";

export function SubjectsSection() {
  const { t } = useT();
  const { courses, loading, error } = useCourses({ per_page: 3 });
  return (
    <section className="relative bg-primary-subtle">
      <div className="relative mx-auto w-full max-w-[1120px] px-5 py-12 md:px-6 md:py-16 xl:px-0">
        <PaperPlaneIcon size={30} strokeWidth={1.3} className="pointer-events-none absolute end-32 top-6 text-primary" />
        <TriangleIcon size={10} className="pointer-events-none absolute start-1/3 top-10 rotate-90 text-accent" />
        <Reveal>
          <SectionHeading badge={t("landing.subjectsBadge")} before={t("landing.subjectsTitle1")} highlight={t("landing.subjectsHighlight")} after={t("landing.subjectsTitle2")} subtitle={t("landing.sectionSubtitle")} />
        </Reveal>
        <Reveal delay={120}>
          {loading ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[380px] animate-pulse rounded-2xl border border-border bg-white/70" />
              ))}
            </div>
          ) : error || courses.length === 0 ? (
            <div className="mt-10">
              <ErrorState title={t("subjects.noCoursesTitle")} message={t("subjects.noCoursesText")} />
            </div>
          ) : (
            <CoursesGrid courses={courses} className="mt-10" />
          )}
        </Reveal>
        <Reveal delay={220} className="mt-8 flex items-center justify-center gap-2">
          <Link href="/subjects">
            <Button className="h-11 px-10">{t("common.viewMore")}</Button>
          </Link>
          <Image src="/images/mascot-checklist.png" alt="" width={44} height={44} className="animate-float w-11" />
        </Reveal>
      </div>
    </section>
  );
}
