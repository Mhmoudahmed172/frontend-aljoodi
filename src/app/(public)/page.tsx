import { HeroSection } from "@/features/landing/components/HeroSection";
import { SnapSections } from "@/features/landing/components/SnapSections";
import { HowSection } from "@/features/landing/components/HowSection";
import { TeachersSection } from "@/features/landing/components/TeachersSection";
import { WhySection } from "@/features/landing/components/WhySection";
import { SubjectsSection } from "@/features/landing/components/SubjectsSection";

export default function HomePage() {
  return (
    <SnapSections>
      <HeroSection />
      <HowSection />
      <TeachersSection />
      <WhySection />
      <SubjectsSection />
    </SnapSections>
  );
}
