'use client'
import { publicStyles as styles } from '@/components/brand/publicStyles'

import { useT } from '@/lib/i18n'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GuideStepsSection } from '@/features/guide/components/GuideStepsSection'
import { GuideDetailsSection } from '@/features/guide/components/GuideDetailsSection'
import { GuideHelpSection } from '@/features/guide/components/GuideHelpSection'

export default function GuidePage() {
  const { t } = useT()
  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('guide.title') }]} />
      </div>
      <PageBanner variant="full" title={t('guide.title')} subtitle={t('guide.subtitle')} />
      <GuideStepsSection />
      <GuideDetailsSection />
      <GuideHelpSection />
    </>
  )
}
