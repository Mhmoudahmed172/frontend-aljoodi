"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LibraryIcon } from "@/components/ui/Icons";
import type { LibrarySubject } from "../types/library.types";

interface LibrarySubjectFilterProps {
  subjects: LibrarySubject[];
  /** Selected subject uuid, or `null` for «الكل». */
  value: string | null;
  onChange: (uuid: string | null) => void;
}

/** Subject cards (icon, name, file count) acting as the library's subject filter; scrolls horizontally on narrow screens. */
export function LibrarySubjectFilter({ subjects, value, onChange }: LibrarySubjectFilterProps) {
  const { t } = useT();
  const total = subjects.reduce((sum, s) => sum + s.files_count, 0);

  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2" role="tablist" aria-label={t("library.subjectsLabel")}>
      <SubjectChip
        active={value === null}
        onClick={() => onChange(null)}
        icon={
          <span className="flex size-full items-center justify-center text-primary">
            <LibraryIcon size={20} />
          </span>
        }
        name={t("library.allSubjects")}
        count={t("library.filesCount", { count: total })}
      />
      {subjects.map((subject) => (
        <SubjectChip
          key={subject.uuid}
          active={value === subject.uuid}
          onClick={() => onChange(subject.uuid)}
          icon={<Image src={subject.icon_url ?? "/images/mascot-book.png"} alt="" fill className="object-contain p-1" sizes="40px" />}
          name={subject.name}
          count={t("library.filesCount", { count: subject.files_count })}
        />
      ))}
    </div>
  );
}

interface SubjectChipProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  name: string;
  count: string;
}

function SubjectChip({ active, onClick, icon, name, count }: SubjectChipProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex min-w-40 shrink-0 items-center gap-3 rounded-2xl border p-3 text-start transition",
        active ? "border-primary bg-primary-subtle shadow-soft" : "border-border bg-white hover:border-primary-soft",
      )}
    >
      <span className={cn("relative size-10 shrink-0 overflow-hidden rounded-xl", active ? "bg-white" : "bg-primary-faint")}>{icon}</span>
      <span className="flex min-w-0 flex-col">
        <span className={cn("max-w-36 truncate text-xs font-bold", active ? "text-primary" : "text-text-heading")}>{name}</span>
        <span className="text-[11px] text-text-muted">{count}</span>
      </span>
    </button>
  );
}
