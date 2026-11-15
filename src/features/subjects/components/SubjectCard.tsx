"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import type { Subject } from "../types/subject.types";

interface SubjectCardProps {
  subject: Subject;
  highlighted?: boolean;
}

/** Public course card: logo top-left, subject icon on a blue blob, name, teacher count and a details CTA. */
export function SubjectCard({ subject, highlighted }: SubjectCardProps) {
  const { t } = useT();
  return (
    <div className={cn("flex flex-col rounded-2xl border bg-white p-4", highlighted ? "border-accent-strong" : "border-border")}>
      <div className="flex items-center justify-end">
        <Logo width={56} href="" />
      </div>
      <Link href={`/subjects/${subject.slug}`} className="relative mt-2 h-48 overflow-hidden">
        <Image src="/images/blob-blue@2x.png" alt="" width={330} height={299} className="absolute end-0 top-3 h-40 w-auto" />
        <Image
          src={subject.icon_url ?? "/images/mascot-book.png"}
          alt={subject.name}
          width={200}
          height={220}
          className="absolute end-2 top-2 h-44 w-auto object-contain"
        />
      </Link>
      <Link href={`/subjects/${subject.slug}`} className="mt-3 text-[13px] font-bold leading-6 text-text-heading">
        {subject.name}
      </Link>
      <div className="mt-3 flex flex-row-reverse items-center justify-between border-t border-border pt-3">
        <span className="text-xs font-semibold text-text-muted">
          {subject.teachers_count} {t("common.teachersLabel")}
        </span>
        <Link href={`/subjects/${subject.slug}`}>
          <Button size="md" className="h-10 px-8 text-xs">
            {t("common.subscribeNow")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
