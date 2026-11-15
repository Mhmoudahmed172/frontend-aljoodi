"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function WhySection() {
  const { t, raw } = useT();
  const reasons = raw<{ title: string; desc: string }[]>("landing.reasons");
  return (
    <section className="relative mx-auto w-full max-w-[1120px] overflow-visible px-5 py-12 md:px-6 md:py-16 xl:px-0">
      <Reveal>
        <SectionHeading badge={t("landing.whyBadge")} before={t("landing.whyTitle1")} highlight={t("landing.whyHighlight")} after={t("landing.whyTitle2")} subtitle={t("landing.sectionSubtitle")} />
      </Reveal>
      <div className="relative mt-12">
        <svg className="pointer-events-none absolute -inset-x-10 top-24 h-32 w-[calc(100%+80px)] text-accent" viewBox="0 0 1200 120" fill="none" preserveAspectRatio="none">
          <path d="M0 70 C 200 110, 350 30, 550 60 S 850 110, 1000 60 S 1150 20, 1200 40" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
        </svg>
        <Image src="/images/mascot-checklist.png" alt="" width={90} height={90} className="pointer-events-none absolute -end-2 top-36 hidden w-16 md:block" />
        <Image src="/images/mascot-book.png" alt="" width={90} height={90} className="pointer-events-none absolute -start-2 top-24 hidden w-16 md:block" />
        <div className="relative mx-auto grid max-w-[760px] gap-x-5 gap-y-10 md:grid-cols-3 md:gap-y-14">
          {reasons.map((reason, i) => {
            const yellow = i % 2 === 0;
            return (
              <Reveal key={reason.title} delay={i * 80} className={cn((i === 1 || i === 4) && "md:mt-8")}>
                <div
                  className={cn(
                    "relative mt-5 rounded-2xl border px-4 pb-4 pt-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
                    yellow ? "border-accent-card bg-accent-card-bg/40" : "border-primary bg-primary-tint",
                  )}
                >
                  {/* Notch: a white disc hides the straight border under the badge, and a clipped ring draws the curved cut-out. */}
                  <span className="pointer-events-none absolute -top-6 start-1/2 size-12 -translate-x-1/2 rounded-full bg-white rtl:translate-x-1/2" />
                  <span
                    className={cn(
                      "pointer-events-none absolute -top-6 start-1/2 size-12 -translate-x-1/2 rounded-full border rtl:translate-x-1/2 [clip-path:inset(50%_0_0_0)]",
                      yellow ? "border-accent-card" : "border-primary",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute -top-5 start-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-white p-0.5 rtl:translate-x-1/2",
                      yellow ? "border-accent" : "border-primary",
                    )}
                  >
                    <span className={cn("flex size-full items-center justify-center rounded-full text-xs font-bold text-white", yellow ? "bg-accent" : "bg-primary")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <h3 className="text-sm font-semibold text-text-heading">{reason.title}</h3>
                  <p className="mt-1.5 text-xs leading-[1.5] text-text-muted">{reason.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
