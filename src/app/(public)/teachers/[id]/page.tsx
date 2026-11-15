"use client";

import { useParams } from "next/navigation";
import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ErrorState } from "@/components/ui/ErrorState";
import { TeacherHero } from "@/features/teachers/components/TeacherHero";
import { TeacherAbout } from "@/features/teachers/components/TeacherAbout";
import { TeacherSubjects } from "@/features/teachers/components/TeacherSubjects";
import { useTeacher } from "@/features/teachers/hooks/useTeacher";
import { CtaBanner } from "@/features/teachers/components/CtaBanner";

export default function TeacherDetailsPage() {
  const { t } = useT();
  const params = useParams<{ id: string }>();
  const { teacher, loading, error } = useTeacher(params.id);

  return (
    <>
      <PublicHeader />
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 md:px-6 md:pb-6 xl:px-0">
        <Breadcrumb items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.teachers"), href: "/teachers" }, { label: t("nav.teacherDetails") }]} />
      </div>
      {error ? (
        <div className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-6 xl:px-0">
          <ErrorState />
        </div>
      ) : !loading && teacher ? (
        <>
          <TeacherHero teacher={teacher} variant="full" />
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-5 py-10 md:gap-14 md:px-6 md:py-12 xl:px-0">
            <TeacherAbout teacher={teacher} />
            <TeacherSubjects teacher={teacher} />
            <CtaBanner />
          </div>
        </>
      ) : null}
    </>
  );
}
