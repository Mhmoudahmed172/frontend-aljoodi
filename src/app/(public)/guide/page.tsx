"use client";

import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { GuideStepsSection } from "@/features/guide/components/GuideStepsSection";
import { GuideDetailsSection } from "@/features/guide/components/GuideDetailsSection";
import { GuideHelpSection } from "@/features/guide/components/GuideHelpSection";

export default function GuidePage() {
  const { t } = useT();
  return (
    <>
      <PublicHeader />
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 md:px-6 md:pb-6 xl:px-0">
        <Breadcrumb items={[{ label: t("nav.home"), href: "/" }, { label: t("guide.title") }]} />
      </div>
      <PageBanner variant="full" title={t("guide.title")} subtitle={t("guide.subtitle")} mascot="/images/mascot-book.png" className="[&>div]:mx-auto [&>div]:max-w-[1120px]" />
      <GuideStepsSection />
      <GuideDetailsSection />
      <GuideHelpSection />
    </>
  );
}
