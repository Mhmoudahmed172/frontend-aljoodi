"use client";

import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { GraduationIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from "@/components/ui/Icons";
import type { AuthUser } from "@/features/auth/types/auth.types";

interface Row {
  icon: ReactNode;
  label: string;
  value: string;
}

interface AccountDetailsProps {
  rows: Row[];
  className?: string;
}

export function AccountDetailsCard({ rows, className }: AccountDetailsProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-white px-6", className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between border-b border-border py-4 last:border-b-0">
          <span className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-subtle text-primary">{row.icon}</span>
            {row.label}
          </span>
          <span className="text-xs font-bold text-text-heading" dir="auto">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** `region` -> translated label. Matches the backend `RegionEnum` (`west_bank`|`gaza`). */
function useRegionLabel() {
  const { t } = useT();
  return (region: string | null | undefined) => {
    if (region === "west_bank") return t("auth.westBank");
    if (region === "gaza") return t("auth.gaza");

    return t("common.notAdded");
  };
}

/** `branch` -> translated label. Matches the backend `BranchEnum` (`scientific`|`literary`|`sharia`). */
function useBranchLabel() {
  const { t } = useT();
  return (branch: string | null | undefined) => {
    if (branch === "scientific") return t("common.scientific");
    if (branch === "literary") return t("common.literary");
    if (branch === "sharia") return t("common.sharia");

    return t("common.notAdded");
  };
}

/** Rows for the dashboard profile page. `UserResource` has no "stage" (grade) field yet, so that row falls back to "not added". */
export function useDashboardProfileRows(user?: AuthUser): Row[] {
  const { t } = useT();
  const regionLabel = useRegionLabel();
  const branchLabel = useBranchLabel();
  return [
    { icon: <UserIcon size={16} />, label: t("profile.name"), value: user?.name ?? t("common.notAdded") },
    { icon: <PhoneIcon size={16} />, label: t("profile.phone"), value: user?.mobile ?? t("common.notAdded") },
    { icon: <MapPinIcon size={16} />, label: t("profile.region"), value: regionLabel(user?.region) },
    { icon: <GraduationIcon size={16} />, label: t("profile.stage"), value: t("common.notAdded") },
    { icon: <GraduationIcon size={16} />, label: t("profile.track"), value: branchLabel(user?.branch) },
  ];
}

/** Rows for the public profile page. `UserResource` has no "grade" field yet, so that row falls back to "not added". */
export function usePublicProfileRows(user?: AuthUser): Row[] {
  const { t } = useT();
  const regionLabel = useRegionLabel();
  return [
    { icon: <PhoneIcon size={16} />, label: t("profile.phone"), value: user?.mobile ?? t("common.notAdded") },
    { icon: <GraduationIcon size={16} />, label: t("profile.grade"), value: t("common.notAdded") },
    { icon: <MapPinIcon size={16} />, label: t("profile.region"), value: regionLabel(user?.region) },
    { icon: <MailIcon size={16} />, label: t("profile.email"), value: user?.email ?? t("common.notAdded") },
  ];
}
