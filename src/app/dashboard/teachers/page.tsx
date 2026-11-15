"use client";

import { useT } from "@/lib/i18n";
import { PageBanner } from "@/components/layout/PageBanner";
import { TeachersListing } from "@/features/teachers/components/TeachersListing";

export default function DashboardTeachersPage() {
  const { t } = useT();
  return (
    <div className="flex flex-col gap-6">
      <PageBanner title={<span className="marker">{t("teachers.dashboardTitle")}</span>} subtitle={t("teachers.dashboardSubtitle")} />
      <TeachersListing basePath="/dashboard/teachers" dashboard />
    </div>
  );
}
