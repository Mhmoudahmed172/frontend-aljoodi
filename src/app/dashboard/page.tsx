import { WelcomeBanner } from "@/features/dashboard/components/WelcomeBanner";
import { HomeStatCards } from "@/features/dashboard/components/StatCards";
import { ContinueSection } from "@/features/dashboard/components/ContinueCards";
import { WeeklyProgress } from "@/features/dashboard/components/WeeklyProgress";
import { MySubjectsPreview } from "@/features/dashboard/components/MySubjectsPreview";

/** Dashboard home. The exams widget is hidden until an exam feature exists (no backend API yet). */
export default function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeBanner />
      <HomeStatCards />
      <ContinueSection />
      <WeeklyProgress />
      <MySubjectsPreview />
    </div>
  );
}
