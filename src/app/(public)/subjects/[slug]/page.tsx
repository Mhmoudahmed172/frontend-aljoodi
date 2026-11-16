'use client'
import { publicStyles as styles } from '@/components/brand/publicStyles'

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useT } from '@/lib/i18n'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ErrorState } from '@/components/ui/ErrorState'
import { SubjectPackages } from '@/features/subjects/components/SubjectPackages'
import { SubjectDescription } from '@/features/subjects/components/SubjectDescription'
import { SubjectOtherCourses } from '@/features/subjects/components/SubjectOtherCourses'
import { useSubject } from '@/features/subjects/hooks/useSubject'
import { CtaBanner } from '@/features/teachers/components/CtaBanner'

export default function SubjectDetailsPage() {
  // `useSearchParams()` (the `?course=` of the course card link) requires a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <SubjectDetails />
    </Suspense>
  )
}

function SubjectDetails() {
  const { t } = useT()
  // A subject can have one course per teacher; `?course=` picks the one to show (the first one otherwise).
  const courseSlug = useSearchParams().get('course')
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  const { subject, loading, error } = useSubject(slug)

  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <Breadcrumb
          items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.subjects'), href: '/subjects' }, { label: t('nav.subjectDetails') }]}
        />
      </div>
      <PageBanner
        variant="full"
        title={
          <>
            {subject?.name ?? t('subjects.detailTitle1')} — <span className="marker">{t('subjects.detailHighlight')}</span>
          </>
        }
        subtitle={t('subjects.detailSubtitle')}
      />
      <div className={styles.container + ' flex flex-col gap-12 py-10'}>
        {error ? (
          <ErrorState />
        ) : !loading ? (
          <>
            <SubjectPackages slug={slug} courseSlug={courseSlug} />
            <SubjectDescription slug={slug} courseSlug={courseSlug} />
            <SubjectOtherCourses slug={slug} courseSlug={courseSlug} />
          </>
        ) : null}
      </div>
      <CtaBanner />
    </>
  )
}
