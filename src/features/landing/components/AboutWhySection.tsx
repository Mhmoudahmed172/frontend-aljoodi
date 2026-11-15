"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const mascots = ["/images/mascot-book.png", "/images/mascot-checklist.png", "/images/mascot-chart.png", "/images/mascot-trophy.png"];

/**
 * About page "Why choose Aljoodi?" section (Figma UI-58): light-blue badge "كيف يساعدك الجودي؟", glowing heading
 * "لماذا تختار الجودي؟" with its subtext, then four feature cards in a horizontal row.
 */
export function AboutWhySection() {
  const { t, raw } = useT();
  const features = raw<{ title: string; desc: string }[]>("about.features");

  return (
    <section className="relative mx-auto w-full max-w-[1120px] px-5 py-12 md:px-6 md:py-16 xl:px-0">
      <Reveal>
        <SectionHeading badge={t("about.whyBadge")} before={t("about.whyTitle1")} highlight={t("about.whyHighlight")} after={t("about.whyTitle2")} subtitle={t("about.whySubtitle")} />
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-4">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 90}>
            <div className="flex h-full min-h-[266px] flex-col items-center gap-5 rounded-xl border border-border bg-white px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <div className="flex h-28 w-full items-center justify-center rounded-xl bg-sky">
                <Image src={mascots[i % mascots.length]} alt="" width={110} height={110} className="h-24 w-auto" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-text-heading">{feature.title}</h3>
                <p className="section-subtitle">{feature.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
