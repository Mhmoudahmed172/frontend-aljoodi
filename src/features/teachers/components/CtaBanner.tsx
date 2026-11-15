"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { PlayIcon, TriangleIcon } from "@/components/ui/Icons";

/**
 * "Start today" call-to-action banner (Figma UI-42): right-aligned 32px/700 title and 16px/400 subtitle, mascot on the
 * LEFT, blue halftone dot matrix once at the top-left edge, and the yellow radial burst anchored OUTSIDE the card on the
 * far bottom-right page border with reduced opacity/scale. "Contact us" button: 180x48, radius 24, #99B9E5 / #0051BD.
 * (`end` = left and `start` = right in this RTL layout.)
 */
export function CtaBanner() {
  const { t } = useT();
  return (
    <div className="relative">
      {/* Yellow radial burst outside the card boundary (bottom-right). */}
      <Image src="/images/decor-dots-yellow.png" alt="" width={200} height={200} className="pointer-events-none absolute -bottom-12 -start-20 w-36 opacity-50" />
      <div className="relative overflow-hidden rounded-2xl bg-primary-subtle px-8 py-10 text-start">
        <Image src="/images/banner-bg-wide-2.png" alt="" fill className="object-cover opacity-80" sizes="1180px" />
        {/* Blue halftone dot matrix once on the top-left edge. */}
        <span className="dots-pattern pointer-events-none absolute -end-6 -top-6 size-40 rotate-180 opacity-40" />
        <Image src="/images/mascot-peek@2x.png" alt="" width={200} height={173} className="pointer-events-none absolute bottom-0 end-10 w-44" />
        <TriangleIcon size={10} className="pointer-events-none absolute bottom-10 end-1/3 text-primary-light" />
        <svg className="pointer-events-none absolute end-[28%] top-1/4 size-6 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z" />
        </svg>
        <div className="relative max-w-[640px]">
          <h2 className="section-title text-[24px] md:text-[32px]">{t("teachers.ctaTitle")}</h2>
          <p className="mt-2 text-base leading-[1.5] text-text-muted">{t("teachers.ctaSubtitle")}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button className="h-12 rounded-3xl px-7 text-base" startIcon={<PlayIcon size={12} />}>
                {t("common.bookFreeLesson")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" className="h-12 w-[180px] rounded-3xl px-7 text-base font-medium">
                {t("common.contactNow")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
