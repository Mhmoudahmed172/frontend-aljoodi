"use client";

import { useParams } from "next/navigation";
import { MySubjectDetails } from "@/features/dashboard/components/MySubjectDetails";

export default function DashboardSubjectPage() {
  const params = useParams<{ slug: string }>();

  return <MySubjectDetails slug={params.slug} />;
}
