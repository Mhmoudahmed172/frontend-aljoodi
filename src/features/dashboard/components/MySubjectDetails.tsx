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
import { SubjectQuizzesList } from "@/features/quizzes/components/SubjectQuizzesList";
import { useSubject, useUnits } from "@/features/subjects/hooks/useSubject";
import { pickCourse, subjectPageTeachers } from "@/features/subjects/utils/teachers";
import { UnitsAccordion } from "@/features/subjects/components/UnitsAccordion";
import { LessonFiles } from "@/features/subjects/components/LessonFiles";
import { useMyCourseFiles, useMySubject } from "../hooks/useMySubjects";

type TabKey = "content" | "exams" | "attachments" | "info";

/**
 * Dashboard subject page for the student's OWN subscription: the ownership/progress guard comes from
 * `GET /user/v1/subjects/{uuid}` (404s when not subscribed), while the curriculum content (units,
 * teachers, course outcomes) is the same reference data as the public catalog detail endpoint.
 */
export function MySubjectDetails({ slug, initialTab = "content" }: { slug: string; initialTab?: TabKey }) {
  const { t } = useT();
  const [tab, setTab] = useState<TabKey>(initialTab);
  const { subject: mySubject, loading: myLoading, error: myError } = useMySubject(slug);
  const { subject, loading, error } = useSubject(slug);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "content", label: t("subjects.tabContent") },
    { key: "exams", label: t("subjects.tabExams") },
    { key: "attachments", label: t("subjects.tabAttachments") },
    { key: "info", label: t("subjects.tabInfo") },
  ];

  if (myError || error) {
    return <ErrorState />;
  }

  if (myLoading || loading || !subject || !mySubject) {
    return null;
  }

  // The subject can have one course per teacher: every tab shows the course the student subscribed to.
  const course = mySubject.course_slug;
  const panels: Record<TabKey, ReactNode> = {
    content: <ContentPanel slug={slug} course={course} />,
    exams: <ExamsPanel slug={slug} course={course} />,
    attachments: <AttachmentsPanel slug={slug} course={course} />,
    info: <InfoPanel slug={slug} course={course} />,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageBanner
        title={
          <>
            {mySubject.name} <span className="marker">{t("subjects.detailHighlight")}</span>
          </>
        }
        subtitle={t("subjects.detailSubtitle")}
      >
        <ProgressBar value={mySubject.progress} label={t("common.progressLevel")} className="mt-2 w-72" />
      </PageBanner>
      <div className="rounded-2xl border border-border bg-white">
        <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
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

function ContentPanel({ slug, course }: { slug: string; course?: string | null }) {
  const { t } = useT();
  return (
    <div>
      <h3 className="text-sm font-bold text-text-heading">{t("subjects.learnTitle")}</h3>
      <UnitsAccordion slug={slug} course={course} className="mt-4" />
    </div>
  );
}

/** "Quizzes" tab: the subject's lessons that carry a quiz with each one's status, plus the pre-exam tips card. */
function ExamsPanel({ slug, course }: { slug: string; course?: string | null }) {
  const { t, raw } = useT();
  const tips = raw<string[]>("subjects.tips");
  return (
    <div>
      <h3 className="text-sm font-bold text-text-heading">{t("subjects.examsTitle")}</h3>
      <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_300px]">
        <SubjectQuizzesList slug={slug} course={course} />
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

/**
 * "Course attachments" tab: the course-level materials (`GET /user/v1/subjects/{id}/files`, active subscribers only)
 * followed by every lesson file grouped by unit/lesson.
 */
function AttachmentsPanel({ slug, course }: { slug: string; course?: string | null }) {
  const { t } = useT();
  const { files, loading } = useMyCourseFiles(slug);
  const { units, loading: unitsLoading } = useUnits(slug, course);
  const lessonsWithFiles = units.flatMap((unit) => unit.lessons.filter((lesson) => lesson.files.length > 0).map((lesson) => ({ unit, lesson })));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-bold text-text-heading">{t("subjects.courseFilesTitle")}</h3>
        {loading ? (
          <div className="mt-3 h-12 animate-pulse rounded-xl bg-surface" />
        ) : files.length === 0 ? (
          <div className="mt-3 flex flex-col items-center gap-2 rounded-xl bg-primary-faint px-5 py-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <FileIcon size={18} />
            </span>
            <p className="text-xs font-bold text-text-heading">{t("subjects.courseFilesEmpty")}</p>
          </div>
        ) : (
          <LessonFiles files={files} className="mt-3" />
        )}
      </div>
      {!unitsLoading && lessonsWithFiles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-text-heading">{t("subjects.lessonFilesTitle")}</h3>
          <div className="mt-3 flex flex-col gap-5">
            {lessonsWithFiles.map(({ unit, lesson }) => (
              <div key={lesson.uuid}>
                <p className="text-xs font-bold text-text-heading">
                  <span className="text-primary">{String(unit.number).padStart(2, "0")}</span> {unit.title} — {lesson.title}
                </p>
                <LessonFiles files={lesson.files} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoPanel({ slug, course: courseSlug }: { slug: string; course?: string | null }) {
  const { t } = useT();
  const { subject } = useSubject(slug);
  const { units } = useUnits(slug, courseSlug);
  if (!subject) return null;

  const course = pickCourse(subject, courseSlug);
  const teachers = subjectPageTeachers(subject, course?.slug);
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

      {course?.outcomes && course.outcomes.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-bold text-primary">{t("subjects.learnTitle")}</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {course.outcomes.map((outcome) => (
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
        <Chip>
          {subject.teachers_count} {t("common.teachersLabel")}
        </Chip>
      </div>
    </div>
  );
}
