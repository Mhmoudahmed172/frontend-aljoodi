"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { AccordionItem } from "@/components/ui/Accordion";
import { useFaqs } from "../hooks/useFaqs";

export function FaqSection() {
  const { t } = useT();
  const { faqs, loading } = useFaqs();
  // Every FAQ hidden (or the request failed): drop the section rather than show an empty card.
  if (!loading && faqs.length === 0) return null;
  return (
    <section className="relative">
      {/* Mascot on the far LEFT of the FAQ header (Figma UI-60; `end` = left in RTL). */}
      <Image src="/images/mascot-checklist.png" alt="" width={80} height={80} className="pointer-events-none absolute -top-4 end-0 w-20" />
      <Image src="/images/decor-dots-yellow.png" alt="" width={200} height={200} className="pointer-events-none absolute -end-24 bottom-0 w-52 opacity-60" />
      <h2 className="text-center text-2xl font-black text-text-heading">
        {t("contact.faqTitle1")} <span className="marker">{t("contact.faqHighlight")}</span>
      </h2>
      <div className="relative mt-8 flex flex-col rounded-2xl border border-border bg-white px-2 py-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-border px-5 py-5 last:border-b-0">
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />
              </div>
            ))
          : faqs.map((faq) => (
              <AccordionItem key={faq.uuid} title={faq.question} className="rounded-none border-b border-border last:border-b-0" headerClassName="py-5">
                <p className="whitespace-pre-line text-xs leading-6 text-text-muted">{faq.answer}</p>
              </AccordionItem>
            ))}
      </div>
    </section>
  );
}
