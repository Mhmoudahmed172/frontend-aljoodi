'use client'
import Image from 'next/image'
import { LOCAL_PREVIEW, isDemoId, previewTeacherLabel } from '@/lib/preview/catalog'
import type { TeacherDetail } from '../types/teacher.types'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function TeacherHero({ teacher, variant = 'card' }: { teacher: TeacherDetail; variant?: 'card' | 'full' }) {
  return (
    <section className={styles.profileHero} style={variant === 'card' ? { borderRadius: 12 } : undefined}>
      <div className={styles.container + ' ' + styles.profileGrid}>
        <div>
          <span className={styles.eyebrow}>
            {teacher.subjects.length ? teacher.subjects.map((s) => s.name).join(' · ') : 'من فريق الجودي التعليمي'}
          </span>
          <h1>{teacher.name || previewTeacherLabel(teacher.uuid)}</h1>
          {teacher.title && <p>{teacher.title}</p>}
          <p>{teacher.subtitle || 'تعرّف على المعلّم من سيرته المنشورة، واستكشف مواده والدروس المتاحة قبل ما تختار.'}</p>
          {LOCAL_PREVIEW && isDemoId(teacher.uuid) && <p>شخصية افتراضية بصورتها التوضيحية؛ البيانات لعرض التجربة.</p>}
          <dl className={styles.profileStats}>
            <div>
              <dt>{LOCAL_PREVIEW && isDemoId(teacher.uuid) ? 'دروس في الكتالوج التجريبي' : 'دروس ضمن المنصة'}</dt>
              <dd>{teacher.stats.lessons_count.toLocaleString('ar-PS')}</dd>
            </div>
            {teacher.stats.students_count > 0 && (
              <div>
                <dt>طلاب ضمن المنصة</dt>
                <dd>{teacher.stats.students_count.toLocaleString('ar-PS')}</dd>
              </div>
            )}
            {teacher.stats.ratings_count > 0 && (
              <div>
                <dt>تقييمات الطلاب</dt>
                <dd>{teacher.stats.ratings_avg}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className={styles.profilePhoto}>
          {teacher.photo_url ? (
            <Image src={teacher.photo_url} alt={teacher.name || 'صورة من ملف المعلّم'} fill sizes="(min-width:768px) 430px,90vw" preload />
          ) : (
            <div className="brand-profile-placeholder">الصورة الشخصية غير متوفّرة</div>
          )}
        </div>
      </div>
    </section>
  )
}
