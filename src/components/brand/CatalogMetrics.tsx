'use client'
import { LOCAL_PREVIEW } from '@/lib/preview/catalog'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { useTeachers } from '@/features/teachers/hooks/useTeachers'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function CatalogMetrics() {
  const { meta: courses } = useCourses({ per_page: 3 })
  const { meta: teachers } = useTeachers({ per_page: 4 })
  if (!courses || !teachers) return null
  return (
    <dl className={styles.metrics} aria-label={LOCAL_PREVIEW ? 'أرقام الكتالوج التجريبي' : 'أرقام الكتالوج'}>
      <div className={styles.metric}>
        <dt>
          <span>{LOCAL_PREVIEW ? 'دورات توضيحية' : 'دورة في الكتالوج'}</span>
        </dt>
        <dd>
          <strong>{courses.total.toLocaleString('ar-PS')}</strong>
        </dd>
      </div>
      <div className={styles.metric}>
        <dt>
          <span>{LOCAL_PREVIEW ? 'ملفّان افتراضيان' : 'ملف معلّم'}</span>
        </dt>
        <dd>
          <strong>{teachers.total.toLocaleString('ar-PS')}</strong>
        </dd>
      </div>
    </dl>
  )
}
