'use client'
import { publicStyles as styles } from '@/components/brand/publicStyles'

import { useT } from '@/lib/i18n'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SubjectsListing } from '@/features/subjects/components/SubjectsListing'

export default function SubjectsPage() {
  const { t } = useT()
  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.subjects') }]} />
      </div>
      <PageBanner
        variant="full"
        title={
          <>
            {t('subjects.pageTitle1')} <span className="marker">{t('subjects.pageHighlight')}</span> {t('subjects.pageTitle2')}
          </>
        }
        subtitle={t('subjects.pageSubtitle')}
      />
      <div className={styles.container + ' py-10'}>
        <SubjectsListing />
      </div>
    </>
  )
}
