import { WelcomeBanner } from "@/features/dashboard/components/WelcomeBanner";
import { EmptySubjects } from "@/features/subjects/components/EmptySubjects";

/** Empty-state variant of the home page for students without subjects. */
export default function DashboardSubscribePage() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeBanner detailed={false} />
      <EmptySubjects />
    </div>
  );
}
