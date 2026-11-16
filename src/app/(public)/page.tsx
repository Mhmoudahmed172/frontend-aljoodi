import { HeroSection } from '@/features/landing/components/HeroSection'
import { TeachersSection } from '@/features/landing/components/TeachersSection'
import { SubjectsSection } from '@/features/landing/components/SubjectsSection'
import { CtaBanner } from '@/features/teachers/components/CtaBanner'
export default function HomePage() {
  return (
    <main className="aj-home">
      <HeroSection />
      <TeachersSection />
      <SubjectsSection />
      <CtaBanner compact />
    </main>
  )
}
