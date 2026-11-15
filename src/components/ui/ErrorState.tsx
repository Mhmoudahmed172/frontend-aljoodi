"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Minimal not-found/error placeholder for a failed data fetch (e.g. a 404 `ApiError`). */
export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  const { t } = useT();
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <Image src="/images/mascot-sad.png" alt="" width={120} height={90} className="w-28" />
      <p className="text-sm font-bold text-text-heading">{title ?? t("common.notFound.title")}</p>
      <p className="text-xs text-text-muted">{message ?? t("common.notFound.message")}</p>
      {onRetry && (
        <Button className="mt-2 h-10 px-8 text-xs" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
