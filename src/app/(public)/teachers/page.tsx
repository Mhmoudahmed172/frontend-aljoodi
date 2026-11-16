'use client'
import { publicStyles as styles } from '@/components/brand/publicStyles'

import { useT } from '@/lib/i18n'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { TeachersListing } from '@/features/teachers/components/TeachersListing'

export default function TeachersPage() {
  const { t } = useT()
  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.teachers') }]} />
      </div>
      <PageBanner
        variant="full"
        title={
          <>
            {t('teachers.pageTitle1')} <span className="marker">{t('teachers.pageHighlight')}</span> {t('teachers.pageTitle2')}
          </>
        }
        subtitle={t('teachers.pageSubtitle')}
      />
      <div className={styles.container + ' py-10'}>
        <TeachersListing basePath="/teachers" />
      </div>
    </>
  )
}
