"use client";

import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { BookOpenIcon, BriefcaseIcon, GraduationIcon } from "@/components/ui/Icons";
import { useDashboardSummary } from "../hooks/useDashboard";

interface Stat {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "blue" | "red" | "orange" | "green" | "outline";
}

const tones = {
  blue: "bg-sky border-primary-soft",
  red: "bg-danger-soft border-danger-soft",
  orange: "bg-warning-soft border-warning-soft",
  green: "bg-success-soft border-success-soft",
  outline: "bg-sky border-primary",
};
const iconTones = {
  blue: "bg-primary",
  red: "bg-danger",
  orange: "bg-warning",
  green: "bg-success",
  outline: "bg-primary",
};

/**
 * Dashboard statistic card (Figma UI-47): 154px tall, radius 8, padding 16, gap 12, #ECF6FE fill with a #B9D9FD/40%
 * curve overlay and a 1px #99B9E5 border. 48px primary icon badge, 12px #5B5B5B label and 24px bold value — all
 * aligned to the start (right) edge.
 */
export function StatCard({ icon, label, value, tone = "blue" }: Stat) {
  return (
    <div className={cn("relative min-h-[154px] overflow-hidden rounded-lg border p-4", tones[tone])}>
      <span className="pointer-events-none absolute -bottom-12 -end-8 h-32 w-3/4 rounded-[50%] bg-sky-wave/40" />
      <div className="relative flex flex-col items-start gap-3 text-start">
        <span className={cn("flex size-12 items-center justify-center rounded-lg text-white", iconTones[tone])}>{icon}</span>
        <span className="text-xs leading-[1.5] text-text-muted">{label}</span>
        <span className="text-2xl font-bold leading-[1.5] text-black" dir="ltr">
          {value}
        </span>
      </div>
    </div>
  );
}

/** Wallet / completed lessons / active subscriptions cards, loaded from `GET /user/v1/dashboard/summary`. */
export function HomeStatCards() {
  const { t } = useT();
  const { summary, loading } = useDashboardSummary();

  const values = [
    loading ? "—" : String(summary?.active_subscriptions_count ?? 0),
    loading ? "—" : String(summary?.completed_lessons_count ?? 0),
    loading ? "—" : summary?.wallet_balance.toFixed(2) ?? "0.00",
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
      <StatCard icon={<GraduationIcon size={22} />} label={t("dashboard.completedSubjects")} value={values[0]} />
      <StatCard icon={<BookOpenIcon size={22} />} label={t("dashboard.passedExams")} value={values[1]} />
      <StatCard icon={<BriefcaseIcon size={22} />} label={t("dashboard.balance")} value={values[2]} />
    </div>
  );
}
