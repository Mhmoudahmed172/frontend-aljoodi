"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const mascots = ["/images/mascot-signup.png", "/images/mascot-book.png", "/images/mascot-checklist.png", "/images/mascot-trophy.png"];

/** Four numbered "getting started" cards, same card language as the landing "how" section. */
export function GuideStepsSection() {
  const { t, raw } = useT();
  const steps = raw<{ title: string; desc: string }[]>("guide.steps");
  return (
    <section className="relative mx-auto w-full max-w-[1120px] px-5 py-12 md:px-6 md:py-16 xl:px-0">
      <span className="pointer-events-none absolute -start-4 top-16 size-8 rounded-full bg-primary-soft" />
      <span className="pointer-events-none absolute end-8 top-14 size-5 rounded-full bg-primary-soft" />
      <Reveal>
        <SectionHeading badge={t("guide.stepsBadge")} before={t("guide.stepsTitle1")} highlight={t("guide.stepsHighlight")} after={t("guide.stepsTitle2")} subtitle={t("guide.stepsSubtitle")} />
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 90}>
            <div className="relative flex h-[290px] flex-col items-center justify-between rounded-xl border border-border bg-white px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <span className="absolute -top-4 start-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-2 flex h-28 w-full items-center justify-center rounded-xl bg-accent-subtle">
                <Image src={mascots[i]} alt="" width={110} height={110} className="h-24 w-auto" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-text-heading">{step.title}</h3>
                <p className="section-subtitle line-clamp-3">{step.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
