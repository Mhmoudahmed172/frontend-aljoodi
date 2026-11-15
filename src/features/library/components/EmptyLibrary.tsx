"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";

/** Shown when the student holds no active subscription: the library is subscribers-only, so point them to the catalogue. */
export function EmptyLibrary() {
  const { t } = useT();

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary bg-primary-faint px-6 py-10 text-center">
      <Image src="/images/mascot-question.png" alt="" width={120} height={90} className="w-28" />
      <p className="text-sm font-bold text-text-heading">{t("library.noSubscriptionTitle")}</p>
      <p className="max-w-md text-xs text-text-muted">{t("library.noSubscriptionText")}</p>
      <Link
        href="/dashboard/explore"
        className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-primary px-8 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
      >
        {t("library.browseSubjects")}
      </Link>
    </div>
  );
}
