"use client";

import { useT } from "@/lib/i18n";
import { PageBanner } from "@/components/layout/PageBanner";
import { useDashboardUser } from "@/components/layout/DashboardUserContext";
import { useDashboardSummary } from "../hooks/useDashboard";

interface WelcomeBannerProps {
  /** Show the third line about active subscriptions. */
  detailed?: boolean;
}

export function WelcomeBanner({ detailed = true }: WelcomeBannerProps) {
  const { t } = useT();
  const { user } = useDashboardUser();
  const { summary, loading } = useDashboardSummary();
  return (
    <PageBanner title={t("dashboard.greeting", { name: user?.name ?? t("dashboard.userName") })} subtitle={t("dashboard.greetingSubtitle")}>
      {detailed && !loading && summary && (
        <p className="text-xs text-text">
          {t("dashboard.greetingLine", { count: summary.active_subscriptions_count })}{" "}
          <span className="font-bold text-primary">{t("dashboard.greetingHighlight")}</span>
        </p>
      )}
    </PageBanner>
  );
}
