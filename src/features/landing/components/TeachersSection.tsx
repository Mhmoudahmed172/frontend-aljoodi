"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TeacherCard } from "@/features/teachers/components/TeacherCard";
import { useTeachers } from "@/features/teachers/hooks/useTeachers";
import { ChevronLeftIcon, ChevronRightIcon, PaperPlaneIcon, TriangleIcon } from "@/components/ui/Icons";

const LIMIT = 12;

/**
 * Landing teachers section: a horizontally scrolling, snap-aligned row of teacher cards (4 visible on desktop) with
 * previous/next buttons. Loads up to 12 teachers from `GET /api/v1/teachers`.
 */
export function TeachersSection() {
  const { t } = useT();
  const { teachers } = useTeachers({ per_page: LIMIT });
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // In RTL `scrollLeft` runs from 0 to a negative value, so track the absolute offset.
  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const offset = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(offset > 4);
    setCanNext(offset < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons, teachers.length]);

  const scrollByCards = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: (rtl ? -direction : direction) * step, behavior: "smooth" });
  };

  return (
    <section className="relative mx-auto w-full max-w-[1120px] px-5 py-10 md:px-6 xl:px-0">
      <PaperPlaneIcon size={30} strokeWidth={1.3} className="pointer-events-none absolute end-32 top-2 text-primary" />
      <TriangleIcon size={10} className="pointer-events-none absolute start-1/3 top-6 rotate-90 text-accent" />
      <span className="pointer-events-none absolute start-2 top-40 size-9 rounded-full bg-primary-soft" />
      <span className="pointer-events-none absolute end-4 top-64 size-3 rounded-full bg-primary-soft" />
      <Reveal>
        <SectionHeading badge={t("landing.teachersBadge")} before={t("landing.teachersTitle1")} highlight={t("landing.teachersHighlight")} after={t("landing.teachersTitle2")} subtitle={t("landing.sectionSubtitle")} />
      </Reveal>
      <div className="relative mt-8 md:mt-10">
        <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 md:gap-6">
          {teachers.map((teacher, i) => (
            <Reveal
              key={teacher.uuid}
              delay={Math.min(i, 3) * 90}
              className="w-[78%] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1 sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)]"
            >
              <div data-card>
                <TeacherCard teacher={teacher} href={`/teachers/${teacher.uuid}`} tone={i % 2 === 0 ? "yellow" : "blue"} />
              </div>
            </Reveal>
          ))}
        </div>
        {(canPrev || canNext) && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <ScrollButton onClick={() => scrollByCards(-1)} disabled={!canPrev} label={t("common.prev")}>
              <ChevronRightIcon size={20} />
            </ScrollButton>
            <ScrollButton onClick={() => scrollByCards(1)} disabled={!canNext} label={t("common.next")}>
              <ChevronLeftIcon size={20} />
            </ScrollButton>
          </div>
        )}
      </div>
    </section>
  );
}

function ScrollButton({ onClick, disabled, label, children }: { onClick: () => void; disabled: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex size-11 items-center justify-center rounded-full border transition",
        disabled ? "cursor-default border-border bg-white text-text-soft" : "border-primary bg-primary text-white hover:bg-primary-hover",
      )}
    >
      {children}
    </button>
  );
}
