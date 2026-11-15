"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export function PublicFooter() {
  const { t } = useT();
  const columns = [
    { title: t("footer.explore"), items: [[t("nav.teachers"), "/teachers"], [t("nav.subjects"), "/subjects"], [t("footer.successStories"), "/about"]] },
    { title: t("footer.company"), items: [[t("nav.about"), "/about"], [t("nav.contact"), "/contact"], [t("footer.guide"), "/guide"]] },
    { title: t("footer.contact"), items: [[t("footer.email"), `mailto:${t("footer.email")}`], [t("footer.phone"), `tel:${t("footer.phone")}`], [t("footer.address"), "/contact"]] },
    { title: t("footer.legal"), items: [[t("footer.terms"), "/about"], [t("footer.privacy"), "/privacy-policy"]] },
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-6 md:py-12 xl:px-0">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex flex-col leading-none">
              <span className="text-[38px] font-black tracking-tight">{t("brand.name")}</span>
              <span className="text-[10px] font-semibold tracking-[0.35em]">{t("brand.academy")}</span>
            </div>
            <p className="mt-5 text-xs leading-6 text-white/90">{t("footer.about")}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:gap-12">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h4 className="text-sm font-bold">{col.title}</h4>
                {col.items.map(([label, href]) => (
                  <Link key={label} href={href} className="text-xs text-white/90 hover:text-white" dir="auto">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-white/60 pt-5 text-center text-xs">{t("footer.copyright")}</div>
      </div>
    </footer>
  );
}
