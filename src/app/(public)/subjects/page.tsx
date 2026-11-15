"use client";

import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SubjectsListing } from "@/features/subjects/components/SubjectsListing";

export default function SubjectsPage() {
  const { t } = useT();
  return (
    <>
      <PublicHeader />
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 md:px-6 md:pb-6 xl:px-0">
        <Breadcrumb items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.subjects") }]} />
      </div>
      <PageBanner
        variant="full"
        title={
          <>
            {t("subjects.pageTitle1")} <span className="marker">{t("subjects.pageHighlight")}</span> {t("subjects.pageTitle2")}
          </>
        }
        subtitle={t("subjects.pageSubtitle")}
        className="[&>div]:mx-auto [&>div]:max-w-[1120px]"
      />
      <div className="mx-auto w-full max-w-[1120px] px-5 py-8 md:px-6 md:py-10 xl:px-0">
        <SubjectsListing />
      </div>
    </>
  );
}
