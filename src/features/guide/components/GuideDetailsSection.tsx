"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { AccordionItem } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CheckCircleSolidIcon } from "@/components/ui/Icons";

type GuideSection = { title: string; items: string[] };

/** Collapsible, numbered walkthrough per area of the platform (same accordion as the contact FAQ). */
export function GuideDetailsSection() {
  const { t, raw } = useT();
  const sections = raw<GuideSection[]>("guide.sections");
  return (
    <section className="relative bg-primary-faint">
      <div className="relative mx-auto w-full max-w-[1120px] px-5 py-12 md:px-6 md:py-16 xl:px-0">
        <Image src="/images/mascot-checklist.png" alt="" width={80} height={80} className="pointer-events-none absolute -top-2 start-0 hidden w-20 md:block" />
        <Image src="/images/decor-dots-yellow.png" alt="" width={200} height={200} className="pointer-events-none absolute -end-24 bottom-0 w-52 opacity-60" />
        <Reveal>
          <SectionHeading badge={t("guide.detailsBadge")} before={t("guide.detailsTitle1")} highlight={t("guide.detailsHighlight")} after={t("guide.detailsTitle2")} subtitle={t("guide.detailsSubtitle")} />
        </Reveal>
        <Reveal delay={120}>
          <div className="relative mt-8 flex flex-col rounded-2xl border border-border bg-white px-2 py-2">
            {sections.map((section, i) => (
              <AccordionItem
                key={section.title}
                title={
                  <>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-black text-primary">{i + 1}</span>
                    <span>{section.title}</span>
                  </>
                }
                defaultOpen={i === 0}
                className="rounded-none border-b border-border last:border-b-0"
                headerClassName="py-5"
              >
                <ol className="flex flex-col gap-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-7 text-text">
                      <CheckCircleSolidIcon size={18} className="mt-1 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </AccordionItem>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
