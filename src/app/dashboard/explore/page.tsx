"use client";

import { useT } from "@/lib/i18n";
import { PageBanner } from "@/components/layout/PageBanner";
import { SubjectsListing } from "@/features/subjects/components/SubjectsListing";

/** Dashboard "explore subjects": the public course catalog (search + pagination) so a student can find and subscribe to more subjects. */
export default function DashboardExplorePage() {
  const { t } = useT();
  return (
    <div className="flex flex-col gap-6">
      <PageBanner title={<span className="marker">{t("dashboard.exploreTitle")}</span>} subtitle={t("dashboard.exploreSubtitle")} mascot="/images/mascot-book.png" />
      <SubjectsListing />
    </div>
  );
}
