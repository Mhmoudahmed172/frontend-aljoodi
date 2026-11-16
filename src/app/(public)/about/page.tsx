'use client'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { AboutSection } from '@/features/landing/components/AboutSection'
import { CtaBanner } from '@/features/teachers/components/CtaBanner'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'عن الجودي' }]} />
      </div>
      <PageBanner
        variant="full"
        tone="ink"
        title="وراء كل خطوة أوضح، فهم أعمق."
        subtitle="الجودي منصة للتوجيهي الفلسطيني، بتقرّب المسافة بين المعلّم والمحتوى وخطتك الدراسية."
      />
      <AboutSection />
      <CtaBanner />
    </>
  )
}
