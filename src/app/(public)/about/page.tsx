"use client";

import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AboutSection } from "@/features/landing/components/AboutSection";
import { AboutWhySection } from "@/features/landing/components/AboutWhySection";

export default function AboutPage() {
  const { t } = useT();
  return (
    <>
      <PublicHeader />
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 md:px-6 md:pb-6 xl:px-0">
        <Breadcrumb items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.about") }]} />
      </div>
      <PageBanner variant="full" title={t("about.title")} subtitle={t("about.subtitle")} mascot="/images/mascot-headset@2x.png" className="[&>div]:mx-auto [&>div]:max-w-[1120px]" />
      <div className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-6 md:py-14 xl:px-0">
        <AboutSection />
      </div>
      <AboutWhySection />
    </>
  );
}
