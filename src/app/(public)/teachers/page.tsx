"use client";

import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TeachersListing } from "@/features/teachers/components/TeachersListing";

export default function TeachersPage() {
  const { t } = useT();
  return (
    <>
      <PublicHeader />
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 md:px-6 md:pb-6 xl:px-0">
        <Breadcrumb items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.teachers") }]} />
      </div>
      <PageBanner
        variant="full"
        title={
          <>
            {t("teachers.pageTitle1")} <span className="marker">{t("teachers.pageHighlight")}</span> {t("teachers.pageTitle2")}
          </>
        }
        subtitle={t("teachers.pageSubtitle")}
        className="[&>div]:mx-auto [&>div]:max-w-[1120px]"
      />
      <div className="mx-auto w-full max-w-[1120px] px-5 py-8 md:px-6 md:py-10 xl:px-0">
        <TeachersListing basePath="/teachers" />
      </div>
    </>
  );
}
