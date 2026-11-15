"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Logo } from "@/components/ui/Logo";
import { StarIcon, VideoIcon } from "@/components/ui/Icons";
import type { Teacher } from "../types/teacher.types";

interface TeacherCardProps {
  teacher: Teacher;
  href: string;
  /** Dashboard variant shows subscription state and progress. */
  dashboard?: boolean;
  /** Alternates the card background tone in a grid — purely decorative, no backend field for it. */
  tone?: "yellow" | "blue";
}

/** Metadata icon inside its rounded #F3EEFA container (Figma card footer). */
function StatIcon({ children }: { children: React.ReactNode }) {
  return <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lilac text-primary">{children}</span>;
}

/**
 * Teacher card (Figma): image on a blue/yellow rounded block → centered bold name → centered subject tag →
 * footer with students / lessons / rating separated by vertical dividers.
 */
export function TeacherCard({ teacher, href, dashboard = false, tone = "blue" }: TeacherCardProps) {
  const { t } = useT();
  const yellow = tone === "yellow";
  const subjectName = teacher.subjects[0]?.name;
  const pending = !teacher.subscribed && teacher.subscription_status === "pending";

  return (
    <Link href={href} className="flex flex-col rounded-2xl border border-border bg-white p-3 transition hover:shadow-card">
      <div className={cn("relative h-52 overflow-hidden rounded-xl", yellow ? "bg-accent-card" : "bg-primary")}>
        <span className="absolute start-1/2 top-2 -translate-x-1/2 rtl:translate-x-1/2">
          <Logo width={56} href="" className={cn(!yellow && "brightness-0 invert")} />
        </span>
        <span className="absolute -end-4 top-8 size-16 rounded-full bg-white/25" />
        <span className="absolute end-8 top-20 size-9 rounded-full bg-white/20" />
        <span className="absolute start-6 top-14 size-6 rounded-full bg-white/20" />
        {/* A real photo fills the whole block; the mascot fallback keeps its centered look over the brand block. */}
        {teacher.photo_url ? (
          <Image src={teacher.photo_url} alt={teacher.name ?? ""} fill sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw" className="object-cover object-[center_25%]" />
        ) : (
          <Image
            src="/images/mascot-question.png"
            alt={teacher.name ?? ""}
            width={180}
            height={180}
            className="absolute bottom-0 start-1/2 h-40 w-auto -translate-x-1/2 object-contain rtl:translate-x-1/2"
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-1 pt-3 text-center">
        {dashboard && (
          <Badge tone={teacher.subscribed ? "green" : pending ? "yellow" : "red"} className="text-[10px]">
            {teacher.subscribed ? t("teachers.teachingNow") : pending ? t("teachers.subscriptionPending") : t("teachers.notSubscribed")}
          </Badge>
        )}
        <span className="text-base font-bold text-text-heading">{teacher.name}</span>
        {subjectName && <span className="text-xs font-semibold text-primary">{subjectName}</span>}
        {dashboard && teacher.subscribed && <ProgressBar value={teacher.progress ?? 0} label={t("teachers.progressWith")} className="mt-1 w-full" />}
        <div className="mt-3 flex w-full items-center justify-between border-t border-border pt-3 text-[11px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <StatIcon>
              <VideoIcon size={12} />
            </StatIcon>
            {t("common.lessons", { count: teacher.stats.lessons_count })}
          </span>
          <span className="h-5 w-px bg-primary/40" />
          <span className="flex items-center gap-1">
            <StarIcon size={14} className="text-accent" />({teacher.stats.ratings_avg})
          </span>
        </div>
      </div>
    </Link>
  );
}
