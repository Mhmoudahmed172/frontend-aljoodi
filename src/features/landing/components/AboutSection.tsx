"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { EyeIcon, TargetIcon } from "@/components/ui/Icons";

/** "About Aljoodi" section: overlapping classroom photos, intro text, vision and mission. */
export function AboutSection() {
  const { t } = useT();
  const items = [
    { icon: <EyeIcon size={22} />, title: t("about.vision"), text: t("about.visionText") },
    { icon: <TargetIcon size={22} />, title: t("about.mission"), text: t("about.visionText") },
  ];
  return (
    <section className="flex flex-col gap-12">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col items-start gap-4">
          <h2 className="section-title">
            {t("about.aboutTitle1")} <span className="marker">{t("about.aboutHighlight")}</span>
          </h2>
          <p className="text-base leading-[1.5] text-text-muted">{t("about.aboutText")}</p>
        </div>
        <div className="relative mx-auto h-[340px] w-full max-w-[420px]">
          <span className="pointer-events-none absolute -top-6 start-1/2 size-9 rounded-full bg-primary-soft" />
          <span className="pointer-events-none absolute start-[60%] top-0 size-3 rounded-full bg-primary-soft" />
          <span className="dots-matrix-yellow pointer-events-none absolute -bottom-4 -end-4 size-32 rounded-full" aria-hidden />
          <Image src="/images/classroom-1.jpg" alt="" width={368} height={368} className="absolute end-0 top-0 h-[260px] w-[72%] rounded-2xl object-cover shadow-card" />
          <Image src="/images/classroom-2.jpg" alt="" width={368} height={244} className="absolute bottom-0 start-0 h-[180px] w-[60%] rounded-2xl border-4 border-white object-cover shadow-card" />
        </div>
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">{item.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-text-heading">{item.title}</h3>
              <p className="mt-1 text-sm leading-[1.5] text-text-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
