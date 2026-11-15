"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Badge";
import { RichText } from "@/components/ui/RichText";
import { CheckCircleSolidIcon, TriangleIcon } from "@/components/ui/Icons";
import { htmlToText } from "@/lib/utils/html";
import { useSubject } from "../hooks/useSubject";
import { pickCourse, subjectPageTeachers } from "../utils/teachers";
import { UnitsAccordion } from "./UnitsAccordion";

const BRANCH_KEYS: Record<string, string> = { scientific: "common.scientific", literary: "common.literary", sharia: "common.sharia" };

/**
 * Description card (Figma UI-45): category badges (subject, توجيهي, branch) → full course title → description paragraph →
 * instructor cards (avatar, name, role badge, bio — one per course teacher) preceded by a yellow spark → "what you will learn" list with blue checks →
 * curriculum accordion with the mascot + down-pointing dashed arrow above it on the left.
 * Yellow halftone on the top-left edge, blue circle accent on the far right. Loaded from `GET /api/v1/subjects/{slug}`.
 * (`start` = right and `end` = left in this RTL layout.)
 */
export function SubjectDescription({ slug, courseSlug }: { slug: string; courseSlug?: string | null }) {
  const { t } = useT();
  const { subject, loading } = useSubject(slug);
  const course = subject ? pickCourse(subject, courseSlug) : undefined;
  const teachers = subject ? subjectPageTeachers(subject, course?.slug) : [];
  const outcomes = course?.outcomes ?? [];
  const branches = course?.branches ?? [];
  const description = course?.description ?? null;

  if (loading || !subject) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6">
      <span className="dots-matrix-yellow pointer-events-none absolute -end-8 -top-8 size-40 rounded-full" aria-hidden />
      <span className="pointer-events-none absolute -start-4 top-10 size-9 rounded-full bg-primary-soft" aria-hidden />

      <div className="relative flex flex-wrap items-center gap-2">
        <Chip>{subject.name}</Chip>
        <Chip>{t("common.tawjihi")}</Chip>
        {branches.map((branch) => (
          <Chip key={branch}>{t(BRANCH_KEYS[branch] ?? branch)}</Chip>
        ))}
      </div>
      <h2 className="relative mt-3 text-xl font-black leading-[1.5] text-text-heading">{course?.name ?? subject.name}</h2>
      {description ? (
        <RichText html={description} className="relative mt-2 text-sm leading-[1.6] text-text-muted" />
      ) : (
        <p className="relative mt-2 text-sm leading-[1.6] text-text-muted">{t("subjects.descriptionFallback", { name: course?.name ?? subject.name })}</p>
      )}

      {teachers.length > 0 && (
        <>
          <h3 className="relative mt-6 flex items-center gap-2 text-sm font-bold text-primary">
            <TriangleIcon size={12} className="text-accent" />
            {t(teachers.length > 1 ? "subjects.aboutTeachers" : "subjects.aboutTeacher")}
          </h3>
          <div className="relative mt-3 flex flex-col gap-4">
            {teachers.map((teacher) => {
              const bio = htmlToText(teacher.bio ?? null);

              return (
                <div key={teacher.uuid} className="flex items-start gap-3">
                  <Avatar src={teacher.photo_url ?? "/images/mascot-question.png"} alt="" size={60} className="rounded-xl" />
                  <div className="flex flex-col gap-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-text-heading">
                      {teacher.name}
                      {teacher.title && <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-[11px] font-semibold text-primary">{teacher.title}</span>}
                    </p>
                    {bio && <p className="text-xs leading-[1.6] text-text-muted">{bio}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {outcomes.length > 0 && (
        <>
          <h3 className="relative mt-6 text-sm font-bold text-primary">{t("subjects.learnTitle")}</h3>
          <ul className="relative mt-3 flex flex-col gap-2">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex items-center gap-2 text-xs text-text-muted">
                <CheckCircleSolidIcon size={16} className="shrink-0 text-primary" />
                {outcome}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="relative mt-16">
        {/* Mascot + dashed arrow pointing DOWN at the first unit header, on the left. */}
        <Image src="/images/mascot-checklist.png" alt="" width={60} height={60} className="pointer-events-none absolute -top-14 end-0 w-12" />
        <Image src="/images/decor-arrow-dashed.png" alt="" width={64} height={80} className="pointer-events-none absolute -top-12 end-14 w-12 opacity-70" />
        <h3 className="text-sm font-bold text-primary">{t("subjects.contentTitle")}</h3>
        <UnitsAccordion slug={slug} course={course?.slug} collapsedOnly className="mt-3" />
      </div>
    </div>
  );
}
