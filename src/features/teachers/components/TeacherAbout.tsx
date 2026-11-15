"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { CheckIcon } from "@/components/ui/Icons";
import { RichText } from "@/components/ui/RichText";
import type { TeacherDetail } from "../types/teacher.types";

const FALLBACK_GALLERY = ["/images/classroom-1.jpg", "/images/classroom-2.jpg"];

/**
 * "About the teacher" (Figma UI-40): glowing title + 16px justified bio + yellow-check list on the start side.
 * Methodology cards on the end side: a tall blue container with the photo embedded inside it (with padding) in the
 * left column, and in the right column a blue text box stacked above a standalone photo. A dashed arrow points at them.
 * (`start` = right and `end` = left in this RTL layout.)
 */
export function TeacherAbout({ teacher, compact = false }: { teacher: TeacherDetail; compact?: boolean }) {
  const { t } = useT();
  const gallery = [0, 1].map((i) => teacher.gallery[i]?.url ?? FALLBACK_GALLERY[i]);

  return (
    <section className="relative grid gap-8 md:grid-cols-2 md:items-start">
      <div className="flex flex-col gap-5">
        {!compact && (
          <h2 className="section-title relative">
            <span className="pointer-events-none absolute -start-14 -top-8 size-8 rounded-full bg-primary-soft" />
            {t("teachers.aboutTitle1")} <span className="marker">{t("teachers.aboutHighlight")}</span>
          </h2>
        )}
        {teacher.bio && <RichText html={teacher.bio} className="max-w-[527px] text-justify text-base leading-[1.5] text-text-heading" />}
        {teacher.features.length > 0 && (
          <ul className="flex flex-col gap-3">
            {teacher.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-base leading-[1.5] text-text-muted">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <CheckIcon size={14} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative grid grid-cols-2 gap-4 md:pt-10">
        <Image src="/images/decor-arrow-dashed-lg.png" alt="" width={120} height={80} className="pointer-events-none absolute -start-24 top-16 hidden w-24 rotate-90 opacity-70 md:block" />
        {/* Right column: blue text box above a standalone photo. */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-2xl bg-primary p-5 text-white">
            <h3 className="text-base font-bold">{t("teachers.photoCaption2")}</h3>
            <p className="text-sm leading-[1.5] text-white/85">{t("teachers.photoDesc2")}</p>
          </div>
          <div className="relative h-44 overflow-hidden rounded-2xl">
            <Image src={gallery[1]} alt="" fill className="object-cover" sizes="300px" />
          </div>
        </div>
        {/* Left column: one tall blue container with the photo embedded inside it. */}
        <div className="flex flex-col gap-4 rounded-2xl bg-primary p-4 text-white">
          <div className="relative h-56 overflow-hidden rounded-xl">
            <Image src={gallery[0]} alt="" fill className="object-cover" sizes="300px" />
          </div>
          <h3 className="text-base font-bold">{t("teachers.photoCaption1")}</h3>
        </div>
      </div>
    </section>
  );
}
