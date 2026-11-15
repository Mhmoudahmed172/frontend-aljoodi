"use client";

import { useParams } from "next/navigation";
import { ErrorState } from "@/components/ui/ErrorState";
import { TeacherHero } from "@/features/teachers/components/TeacherHero";
import { TeacherAbout } from "@/features/teachers/components/TeacherAbout";
import { TeacherSubjects } from "@/features/teachers/components/TeacherSubjects";
import { useTeacher } from "@/features/teachers/hooks/useTeacher";
import { CtaBanner } from "@/features/teachers/components/CtaBanner";

export default function DashboardTeacherPage() {
  const params = useParams<{ id: string }>();
  const { teacher, loading, error } = useTeacher(params.id);

  if (error) {
    return <ErrorState />;
  }

  if (loading || !teacher) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      <TeacherHero teacher={teacher} />
      <TeacherAbout teacher={teacher} />
      <TeacherSubjects teacher={teacher} />
      <CtaBanner />
    </div>
  );
}
