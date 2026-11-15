"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { PlayIcon } from "@/components/ui/Icons";
import { useContinueLearning } from "../hooks/useDashboard";
import type { ContinueLearningItem } from "../types/dashboard.types";

/** One "continue where you left off" subscription card, loaded from `GET /user/v1/dashboard/continue-learning`. */
export function ContinueCard({ item }: { item: ContinueLearningItem }) {
  const { t, raw } = useT();
  const statusLabels = raw<Record<string, string>>("dashboard.status");
  return (
    <Link href={`/dashboard/subjects/${item.subject.slug}`} className="flex gap-4 rounded-2xl border border-border bg-white p-3 transition hover:shadow-card">
      <span className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl">
        <Image src={item.course.cover_url ?? "/images/course-thumb.png"} alt="" fill className="object-cover" sizes="160px" />
      </span>
      <div className="flex flex-1 flex-col">
        <h3 className="text-sm font-bold text-text-heading">{item.course.name}</h3>
        <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-muted">{item.subject.name}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <Badge tone="soft">{statusLabels?.[item.status] ?? item.status}</Badge>
          {item.expires_at && <span className="text-[10px] text-text-muted">{t("dashboard.expiresAt", { date: formatDate(item.expires_at) })}</span>}
        </div>
        <div className="mt-2 flex items-center justify-end">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-white">
            <PlayIcon size={10} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** "Continue where you left off" section. */
export function ContinueSection() {
  const { t } = useT();
  const { items, loading, error } = useContinueLearning();

  if (loading || error || items.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="relative self-start text-xl font-black text-text-heading">
        <span className="marker">{t("dashboard.continueTitle")}</span>
        <Image src="/images/decor-arrow-dashed.png" alt="" width={64} height={80} className="pointer-events-none absolute -start-16 -top-6 w-14 rotate-180 opacity-70" />
      </h2>
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <ContinueCard key={item.uuid} item={item} />
        ))}
      </div>
    </section>
  );
}
