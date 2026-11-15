"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { DownloadIcon, FileIcon, LockIcon } from "@/components/ui/Icons";
import { formatFileSize } from "@/lib/utils/format";
import type { LessonFile } from "../types/subject.types";

interface LessonFilesProps {
  files: LessonFile[];
  className?: string;
}

/**
 * Lesson attachments list. A file with a `url` (free lesson, or a student with access) opens in a new tab;
 * a locked file still shows its name and size with a lock and a "subscribe to open" hint.
 */
export function LessonFiles({ files, className }: LessonFilesProps) {
  const { t } = useT();

  if (files.length === 0) {
    return null;
  }

  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {files.map((file) => {
        const meta = [file.type?.toUpperCase(), file.size ? formatFileSize(file.size) : null].filter(Boolean).join(" · ");
        const row = "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs";
        const info = (
          <span className="flex min-w-0 items-center gap-2">
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", file.url ? "bg-primary-subtle text-primary" : "bg-surface text-text-soft")}>
              <FileIcon size={16} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-semibold text-text-heading" dir="auto">
                {file.name}
              </span>
              {meta && (
                <span className="text-[11px] text-text-muted" dir="ltr">
                  {meta}
                </span>
              )}
            </span>
          </span>
        );

        return (
          <li key={file.uuid}>
            {file.url ? (
              <a href={file.url} target="_blank" rel="noopener noreferrer" className={cn(row, "border-border bg-white transition hover:border-primary hover:shadow-soft")}>
                {info}
                <span className="flex shrink-0 items-center gap-1 font-semibold text-primary">
                  <DownloadIcon size={14} />
                  {t("subjects.attachmentOpen")}
                </span>
              </a>
            ) : (
              <div className={cn(row, "border-dashed border-border bg-surface")} title={t("subjects.attachmentLocked")}>
                {info}
                <span className="flex shrink-0 items-center gap-1 font-semibold text-text-muted">
                  <LockIcon size={14} />
                  {t("subjects.attachmentLocked")}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
