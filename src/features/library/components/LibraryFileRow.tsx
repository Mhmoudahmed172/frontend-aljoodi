"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatDate, formatFileSize } from "@/lib/utils/format";
import { BookOpenIcon, CalendarIcon, DownloadIcon, FileIcon, ImageIcon, LayersIcon, LockIcon } from "@/components/ui/Icons";
import type { LibraryFile } from "../types/library.types";

const IMAGE_TYPES = ["png", "jpg", "jpeg", "gif", "svg", "webp"];

/** Icon + tone of the file badge: PDF red, Word blue, images green, anything else neutral. */
function fileVisual(type: string) {
  const normalized = type?.toLowerCase() ?? "";
  if (normalized === "pdf") return { Icon: FileIcon, tone: "bg-danger-soft text-danger" };
  if (normalized === "doc" || normalized === "docx") return { Icon: FileIcon, tone: "bg-primary-subtle text-primary" };
  if (IMAGE_TYPES.includes(normalized)) return { Icon: ImageIcon, tone: "bg-success-soft text-success" };

  return { Icon: FileIcon, tone: "bg-accent-soft text-accent-strong" };
}

/**
 * One library file: type badge, name, where it comes from (subject · lesson or "course file", then unit / chapter),
 * size and upload date, and an "open" link to `url` in a new tab — or the lock notice while a required quiz blocks it.
 */
export function LibraryFileRow({ file }: { file: LibraryFile }) {
  const { t } = useT();
  const locked = file.is_locked || !file.url;
  const { Icon, tone } = fileVisual(file.type);
  const origin = file.source === "lesson" && file.lesson ? file.lesson.title : [t("library.courseFile"), file.course?.name].filter(Boolean).join(" — ");
  const context = [file.subject?.name, origin].filter(Boolean).join(" · ");
  const placement = [file.unit?.title, file.chapter?.title].filter(Boolean).join(" · ");
  const size = file.size ? formatFileSize(file.size) : null;

  return (
    <li className={cn("flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between", locked ? "border-dashed border-border" : "border-border")}>
      <div className="flex min-w-0 items-start gap-3">
        <span className={cn("relative flex size-11 shrink-0 items-center justify-center rounded-xl", locked ? "bg-surface text-text-soft" : tone)}>
          <Icon size={20} />
          <span className="absolute -bottom-1.5 rounded bg-white px-1 text-[9px] font-black uppercase leading-4 shadow-sm" dir="ltr">
            {file.type}
          </span>
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-bold text-text-heading" dir="auto" title={file.name}>
            {file.name}
          </span>
          <span className="flex min-w-0 items-center gap-1 text-[11px] text-accent-strong">
            <BookOpenIcon size={12} className="shrink-0" />
            <span className="truncate">{context}</span>
          </span>
          {placement && (
            <span className="flex min-w-0 items-center gap-1 text-[11px] text-text-muted">
              <LayersIcon size={12} className="shrink-0" />
              <span className="truncate">{placement}</span>
            </span>
          )}
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted">
            {size && <span dir="ltr">{size}</span>}
            <span className="flex items-center gap-1">
              <CalendarIcon size={12} />
              <span>{t("library.addedAt", { date: formatDate(file.created_at) })}</span>
            </span>
          </span>
        </div>
      </div>
      <div className="flex shrink-0 sm:justify-end">
        {locked ? (
          <span className="flex max-w-full items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted sm:max-w-64">
            <LockIcon size={14} className="shrink-0" />
            <span className="truncate" title={file.locked_by_quiz ? t("library.lockedByQuiz", { title: file.locked_by_quiz.title }) : undefined}>
              {file.locked_by_quiz ? t("library.lockedByQuiz", { title: file.locked_by_quiz.title }) : t("library.locked")}
            </span>
          </span>
        ) : (
          <a
            href={file.url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover sm:w-auto"
          >
            <DownloadIcon size={14} />
            {t("library.open")}
          </a>
        )}
      </div>
    </li>
  );
}
