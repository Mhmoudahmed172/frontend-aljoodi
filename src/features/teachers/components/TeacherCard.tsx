'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useT } from '@/lib/i18n'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { isDemoId, previewTeacherLabel } from '@/lib/preview/catalog'
import type { Teacher } from '../types/teacher.types'
import { publicStyles as styles } from '@/components/brand/publicStyles'
interface Props {
  teacher: Teacher
  href: string
  featured?: boolean
  dashboard?: boolean
  tone?: 'yellow' | 'blue'
}
export function TeacherCard({ teacher, href, dashboard = false, featured = false }: Props) {
  const { t } = useT()
  return (
    <Link href={href} className={styles.teacherCard + (featured ? ' ' + styles.teacherFeatured : '')}>
      <div className={styles.portrait}>
        {teacher.photo_url ? (
          <Image src={teacher.photo_url} alt={teacher.name || 'صورة من ملف المعلّم'} fill sizes="(min-width:1024px) 290px,45vw" />
        ) : (
          <div className="brand-profile-placeholder">الصورة غير متوفّرة</div>
        )}
      </div>
      <div className={styles.teacherCardBody}>
        <h3 className={styles.teacherName}>{teacher.name || previewTeacherLabel(teacher.uuid)}</h3>
        {teacher.subjects.length > 0 && <p className={styles.teacherSubject}>{teacher.subjects.map((s) => s.name).join(' · ')}</p>}
        {!teacher.subjects.length && isDemoId(teacher.uuid) && <p className={styles.teacherStatus}>الاسم والتخصص قيد التوثيق</p>}
        {teacher.title &&
          teacher.title !== teacher.subjects.map((s) => s.name).join(' و') &&
          teacher.title !== teacher.subjects.map((s) => s.name).join(' وال') && <p className={styles.teacherStatus}>{teacher.title}</p>}
        {featured && teacher.subtitle && <p className={styles.teacherSummary}>{teacher.subtitle}</p>}
        {featured && isDemoId(teacher.uuid) && <p className={styles.teacherStatus}>شخصية افتراضية · صورة توضيحية</p>}
        {dashboard && (
          <Badge tone={teacher.subscribed ? 'green' : teacher.subscription_status === 'pending' ? 'yellow' : 'grey'}>
            {teacher.subscribed
              ? t('teachers.teachingNow')
              : teacher.subscription_status === 'pending'
                ? t('teachers.subscriptionPending')
                : t('teachers.notSubscribed')}
          </Badge>
        )}
        {dashboard && teacher.subscribed && <ProgressBar value={teacher.progress ?? 0} label={t('teachers.progressWith')} />}
        <div className={styles.teacherMeta}>
          <span>{t('common.lessons', { count: teacher.stats.lessons_count })}</span>
          {teacher.stats.ratings_count > 0 && <span>التقييم {teacher.stats.ratings_avg}</span>}
          <span>الملف والمواد ←</span>
        </div>
      </div>
    </Link>
  )
}
