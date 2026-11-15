"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PageBanner } from "@/components/layout/PageBanner";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ErrorState } from "@/components/ui/ErrorState";
import { BookIcon, CheckCircleSolidIcon, FileIcon, GraduationIcon } from "@/components/ui/Icons";
import { ExamRow } from "@/features/exams/components/ExamRow";
import { useExams } from "@/features/exams/hooks/useExams";
import { useSubject, useUnits } from "../hooks/useSubject";
import { subjectPageTeachers } from "../utils/teachers";
import { UnitsAccordion } from "./UnitsAccordion";
import { LessonFiles } from "./LessonFiles";

type TabKey = "content" | "exams" | "attachments" | "info";

/** Dashboard subject page: banner with progress and the four tabs, loaded from `GET /api/v1/subjects/{slug}`. */
export function SubjectDetailsTabs({ slug, initialTab = "content" }: { slug: string; initialTab?: TabKey }) {
  const { t } = useT();
  const [tab, setTab] = useState<TabKey>(initialTab);
  const { subject, loading, error } = useSubject(slug);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "content", label: t("subjects.tabContent") },
    { key: "attachments", label: t("subjects.tabAttachments") },
    { key: "info", label: t("subjects.tabInfo") },
  ];

  if (error) {
    return <ErrorState />;
  }

  if (loading || !subject) {
    return null;
  }

  const panels: Record<TabKey, ReactNode> = {
    content: <ContentPanel slug={slug} />,
    exams: <ExamsPanel />,
    attachments: <AttachmentsPanel slug={slug} />,
    info: <InfoPanel slug={slug} />,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageBanner
        title={
          <>
            {subject.name} <span className="marker">{t("subjects.detailHighlight")}</span>
          </>
        }
        subtitle={t("subjects.detailSubtitle")}
      >
        {subject.progress !== undefined && <ProgressBar value={subject.progress} label={t("common.progressLevel")} className="mt-2 w-72" />}
      </PageBanner>
      <div className="rounded-2xl border border-border bg-white">
        {/* The exams tab is hidden until an exam feature exists (no backend API yet). */}
        <div className="grid grid-cols-3 border-b border-border">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "flex items-center justify-center gap-2 border-b-2 px-2 py-4 text-xs font-bold transition md:text-sm",
                tab === item.key ? "border-primary text-primary" : "border-transparent text-text-heading",
              )}
            >
              <BookIcon size={18} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 md:p-6">{panels[tab]}</div>
      </div>
    </div>
  );
}

function ContentPanel({ slug }: { slug: string }) {
  const { t } = useT();
  return (
    <div>
      <h3 className="text-sm font-bold text-text-heading">{t("subjects.learnTitle")}</h3>
      <UnitsAccordion slug={slug} className="mt-4" />
    </div>
  );
}

function ExamsPanel() {
  const { t, raw } = useT();
  const { exams } = useExams();
  const tips = raw<string[]>("subjects.tips");
  return (
    <div>
      <h3 className="text-sm font-bold text-text-heading">{t("subjects.examsTitle")}</h3>
      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="divide-y divide-border">
          {exams.map((exam, i) => (
            <ExamRow key={exam.id + i} exam={exam} />
          ))}
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-primary-faint p-5">
          <Image src="/images/decor-dots-yellow.png" alt="" width={200} height={200} className="pointer-events-none absolute -bottom-10 -start-16 w-44 opacity-60" />
          <h4 className="relative self-start text-sm font-black text-text-heading">
            <span className="marker">{t("subjects.tipsTitle")}</span>
          </h4>
          <ul className="relative mt-4 flex flex-col gap-3">
            {tips.map((tip) => (
              <li key={tip} className="flex items-center gap-2 text-xs text-text">
                <CheckCircleSolidIcon size={16} className="text-primary" />
                {tip}
              </li>
            ))}
          </ul>
          <Image src="/images/mascot-peek@2x.png" alt="" width={200} height={173} className="relative mt-6 w-44" />
        </div>
      </div>
    </div>
  );
}

/** Every lesson file of the subject grouped by unit/lesson (from `GET /api/v1/subjects/{slug}/units`); locked ones show a lock. */
function AttachmentsPanel({ slug }: { slug: string }) {
  const { t } = useT();
  const { units, loading } = useUnits(slug);
  const lessonsWithFiles = units.flatMap((unit) => unit.lessons.filter((lesson) => lesson.files.length > 0).map((lesson) => ({ unit, lesson })));

  return (
    <div>
      <h3 className="text-sm font-bold text-text-heading">{t("subjects.attachmentsTitle")}</h3>
      <p className="mt-1 text-xs text-text-muted">{t("subjects.attachmentsHint")}</p>
      {!loading && lessonsWithFiles.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl bg-primary-faint px-5 py-8 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <FileIcon size={18} />
          </span>
          <p className="text-xs font-bold text-text-heading">{t("subjects.attachmentsEmpty")}</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-5">
          {lessonsWithFiles.map(({ unit, lesson }) => (
            <div key={lesson.uuid}>
              <p className="text-xs font-bold text-text-heading">
                <span className="text-primary">{String(unit.number).padStart(2, "0")}</span> {unit.title} — {lesson.title}
              </p>
              <LessonFiles files={lesson.files} className="mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoPanel({ slug }: { slug: string }) {
  const { t } = useT();
  const { subject } = useSubject(slug);
  const { units } = useUnits(slug);
  if (!subject) return null;

  const teachers = subjectPageTeachers(subject);
  const info = [
    { label: t("subjects.unitsCount"), value: String(units.length) },
    { label: t("subjects.lessonsCount"), value: String(units.reduce((sum, u) => sum + u.lessons.length, 0)) },
  ];

  return (
    <div>
      <h2 className="mt-3 text-lg font-black text-text-heading">{subject.name}</h2>

      {teachers.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-bold text-primary">{t(teachers.length > 1 ? "subjects.teachersLabel" : "subjects.teacherLabel")}</h3>
          <div className="mt-3 flex flex-wrap gap-4">
            {teachers.map((teacher) => (
              <div key={teacher.uuid} className="flex items-center gap-3">
                <Avatar src={teacher.photo_url ?? "/images/mascot-question.png"} alt="" size={44} className="rounded-xl" />
                <span className="text-xs font-bold text-text-heading">{teacher.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {subject.courses[0]?.outcomes && subject.courses[0].outcomes.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-bold text-primary">{t("subjects.learnTitle")}</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {subject.courses[0].outcomes.map((outcome) => (
              <li key={outcome} className="flex items-center gap-2 text-xs text-text-muted">
                <CheckCircleSolidIcon size={16} className="text-primary" />
                {outcome}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-6 text-sm font-bold text-primary">{t("subjects.infoTitle")}</h3>
      <div className="mt-3 grid gap-x-16 gap-y-4 sm:grid-cols-2">
        {info.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-subtle text-primary">
              <GraduationIcon size={16} />
            </span>
            <span className="w-32 text-xs font-bold text-text-heading">{row.label}</span>
            <span className="text-xs text-text-muted">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Chip>{subject.teachers_count} {t("common.teachersLabel")}</Chip>
      </div>
    </div>
  );
}
