"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { Chip } from "@/components/ui/Badge";
import { PlayIcon, StarIcon } from "@/components/ui/Icons";
import { htmlToText } from "@/lib/utils/html";
import type { TeacherDetail } from "../types/teacher.types";

/**
 * Teacher details hero (Figma UI-39): subject chips → 40px bold name with the 14px blue specialization beside it →
 * 16px plain-text description → stats separated by 49px #0051BD dividers. The portrait sits near the far-left edge on a
 * clearly visible blue blob, the yellow dotted matrix behind the blob on the left, and the yellow spark anchored at the
 * top-right of the teacher's head. A blue tinted container sits behind the right-side details.
 * (`start` = right and `end` = left in this RTL layout.) Loaded from `GET /api/v1/teachers/{uuid}`.
 */
export function TeacherHero({ teacher, variant = "card" }: { teacher: TeacherDetail; variant?: "card" | "full" }) {
  const { t } = useT();
  const stats = [
    { label: t("teachers.lessonsCount"), value: t("common.lessonCount", { count: teacher.stats.lessons_count }), icon: <PlayIcon size={14} className="text-primary" /> },
    { label: t("teachers.ratingLabel"), value: `(${teacher.stats.ratings_avg})`, icon: <StarIcon size={16} className="text-accent" /> },
  ];
  const bio = htmlToText(teacher.bio);

  return (
    <div className={variant === "card" ? "relative overflow-hidden rounded-2xl bg-primary-subtle" : "relative overflow-hidden bg-primary-subtle"}>
      <span className="pointer-events-none absolute -start-16 -top-16 size-64 rounded-[60px] border-[18px] border-white/60" />
      <span className="pointer-events-none absolute start-40 top-2 size-6 rounded-full bg-primary-soft" />
      <div className={variant === "card" ? "relative grid gap-6 px-8 py-8 md:grid-cols-2 md:items-center" : "relative mx-auto grid w-full max-w-[1120px] gap-6 px-5 py-8 md:grid-cols-2 md:items-center md:px-6 xl:px-0"}>
        <div className="relative flex flex-col items-start gap-3">
          {/* Blue container shape behind the details (Figma: visible blue fill with opacity). */}
          <span className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[40px] bg-primary/15" aria-hidden />
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((s) => (
              <Chip key={s.uuid}>{s.name}</Chip>
            ))}
          </div>
          <h1 className="flex flex-wrap items-baseline gap-3 text-[32px] font-bold leading-[1.3] text-text-heading md:text-[40px]">
            {teacher.name}
            {teacher.title && <span className="text-sm font-semibold text-primary">{teacher.title}</span>}
          </h1>
          {bio && <p className="max-w-md text-base leading-[1.5] text-text-heading">{bio}</p>}
          <div className="mt-2 flex items-center">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center">
                {i > 0 && <span className="mx-5 h-[49px] w-px bg-primary" aria-hidden />}
                <div className="flex flex-col gap-1.5">
                  <span className="text-base font-semibold text-text-heading">{s.label}</span>
                  <span className="flex items-center gap-1.5 text-base text-text-heading">
                    {s.icon}
                    {s.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-64 md:h-80">
          {/* Yellow dotted matrix behind the blob, on the left. */}
          <span className="dots-matrix-yellow pointer-events-none absolute -end-6 bottom-0 h-56 w-64 rounded-3xl" aria-hidden />
          {teacher.photo_url ? (
            // Uploaded photos are rectangular, so they get a fixed rounded frame (no blob) and are cropped to fill it.
            <div className="absolute bottom-0 end-4 h-64 w-52 md:h-80 md:w-64">
              <div className="relative size-full overflow-hidden rounded-[32px] border-4 border-white bg-white shadow-lg">
                <Image src={teacher.photo_url} alt={teacher.name ?? ""} fill sizes="(min-width: 768px) 256px, 208px" className="object-cover object-top" />
              </div>
              <Image src="/images/decor-sparkle.png" alt="" width={30} height={26} className="absolute -start-3 -top-3 w-7" />
            </div>
          ) : (
            <>
              <Image src="/images/blob-blue@2x.png" alt="" width={330} height={299} className="absolute end-0 top-4 h-72 w-auto" />
              <div className="absolute bottom-0 end-4 h-80">
                <Image src="/images/teacher-hero@3x.png" alt={teacher.name ?? ""} width={300} height={340} className="h-80 w-auto object-contain object-bottom" />
                <Image src="/images/decor-sparkle.png" alt="" width={30} height={26} className="absolute -start-2 top-1 w-7" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
