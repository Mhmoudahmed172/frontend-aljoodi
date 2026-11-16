'use client'

import { CourseCover } from '@/components/brand/CourseCover'
import { Avatar } from '@/components/ui/Avatar'
import { publicStyles as styles } from '@/components/brand/publicStyles'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LOCAL_PREVIEW, isDemoId } from '@/lib/preview/catalog'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'sonner'
import { useT } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { SubscriptionModal } from '@/features/subscription/components/SubscriptionModal'
import { useSessionStatus } from '@/features/auth/hooks/useSessionStatus'
import { withRedirect } from '@/features/auth/utils/redirect'
import { useRegion, type PriceRegion } from '@/features/region/useRegion'
import { cn } from '@/lib/utils'
import { useSubject } from '../hooks/useSubject'
import { pickCourse, subjectCourseHref } from '../utils/teachers'

const SCOPE_LABEL_KEYS = { first: 'subjects.package1', second: 'subjects.package2', both: 'subjects.packageBoth' } as const
const SCOPE_DESC_KEYS = { first: 'subjects.packageDesc1', second: 'subjects.packageDesc2', both: 'subjects.packageDescBoth' } as const

/**
 * Video preview + blue packages card at the top of the public subject page (Figma UI-44): each package shows the title,
 * a 14px #5B5B5B sub-description with a blue check icon, the 20px bold #612FCF price and the subscribe button.
 * Loaded from `GET /api/v1/subjects/{slug}`. Guests are sent to `/login` (returning here afterwards) before the
 * subscription form opens, since `POST /user/v1/subscriptions` needs a signed-in student.
 */
export function SubjectPackages({ slug, courseSlug }: { slug: string; courseSlug?: string | null }) {
  const { t } = useT()
  const router = useRouter()
  const { data: session, isLoading: sessionLoading } = useSessionStatus()
  const [open, setOpen] = useState(false)
  const [demoScope, setDemoScope] = useState<keyof typeof SCOPE_LABEL_KEYS | null>(null)
  const [selectedScope, setSelectedScope] = useState<keyof typeof SCOPE_LABEL_KEYS | null>(null)
  const { subject, loading } = useSubject(slug)
  const { region, setRegion, locked } = useRegion()
  const course = subject ? pickCourse(subject, courseSlug) : undefined
  const regions: PriceRegion[] = ['west_bank', 'gaza']
  const scopes = course
    ? (Object.entries(course.prices) as [keyof typeof SCOPE_LABEL_KEYS, string | null][]).filter(([, price]) => price !== null)
    : []

  if (loading || !course || !subject) {
    return null
  }

  const startSubscription = (scope: keyof typeof SCOPE_LABEL_KEYS) => {
    if (LOCAL_PREVIEW && isDemoId(course.uuid)) {
      setDemoScope(scope)
      return
    }
    if (sessionLoading) return
    if (session?.authenticated !== true) {
      toast.info(t('subjects.loginToSubscribe'))
      router.push(withRedirect('/login', `${subjectCourseHref(slug, course.slug)}#subscribe`))

      return
    }
    setSelectedScope(scope)
    setOpen(true)
  }

  return (
    <div id="subscribe" className={styles.courseLayout}>
      <div className={styles.courseIntro}>
        <CourseCover
          subject={subject.name}
          title={course.name}
          cover={course.cover_url}
          teacherPhoto={course.teachers?.[0]?.photo_url}
          teacherName={course.teachers?.[0]?.name}
        />
        <h2>{course.name}</h2>
        <p>
          ابدأ من الفكرة اللي بدك تفهمها، وتابع تسلسل الدروس خطوة بخطوة. شوف الوحدات، جرّب المحتوى المتاح للمعاينة، واختار الباقة المناسبة لدراستك.
        </p>
        {course.teachers && course.teachers.length > 0 && (
          <div className={styles.instructor}>
            <Avatar src={course.teachers[0].photo_url} alt={course.teachers[0].name} size={56} />
            <p>{course.teachers.map((teacher) => teacher.name).join(' · ')}</p>
          </div>
        )}
        <a href="#course-content" className={styles.textLink}>
          شوف شو رح تدرس ↓
        </a>
      </div>
      <aside className={styles.packages} aria-label="خيارات الاشتراك">
        <h3>{t('subjects.packagesTitle')}</h3>
        <div className="mb-4 flex flex-col gap-3 text-sm text-text-muted">
          <span>{t('subjects.pricesForRegion')}</span>
          {locked ? (
            <strong>{t('subjects.priceRegion.' + region)}</strong>
          ) : (
            <div className="flex gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-xs font-semibold',
                    region === r ? 'border-primary bg-primary text-white' : 'border-border bg-white text-primary',
                  )}>
                  {t('subjects.priceRegion.' + r)}
                </button>
              ))}
            </div>
          )}
        </div>
        {scopes.map(([scope, price]) => (
          <div key={scope} className={styles.package}>
            <div className={styles.packageHead}>
              <span>{t(SCOPE_LABEL_KEYS[scope])}</span>
              <span className={styles.price}>
                {price} {t('common.currency')}
              </span>
            </div>
            <p>{t(SCOPE_DESC_KEYS[scope], { subject: subject.name })}</p>
            <Button fullWidth onClick={() => startSubscription(scope)}>
              {LOCAL_PREVIEW && isDemoId(course.uuid) ? 'اختار هاي الباقة' : t('common.subscribePackage')}
            </Button>
          </div>
        ))}
      </aside>
      <SubscriptionModal open={open} onClose={() => setOpen(false)} courseUuid={course.uuid} scope={selectedScope ?? undefined} />
      <Modal open={demoScope !== null} onClose={() => setDemoScope(null)}>
        <h2 className="mb-4 pe-10 text-2xl font-bold text-primary">راجع اختيارك</h2>
        <p className="mb-3 text-lg font-bold">{course.name}</p>
        {demoScope && (
          <p className="mb-4">
            {t(SCOPE_LABEL_KEYS[demoScope])} · {course.prices[demoScope]} {t('common.currency')}
          </p>
        )}
        <p className="mb-6 text-sm text-text-muted">هذه تجربة محلية بسعر توضيحي. لن يُنشأ اشتراك أو طلب دفع.</p>
        <Button
          fullWidth
          onClick={() => {
            setDemoScope(null)
            toast.success('اكتملت تجربة اختيار الباقة محلياً. لم يتم إنشاء اشتراك أو تحصيل أي مبلغ.')
          }}>
          تأكيد الاختيار التجريبي
        </Button>
      </Modal>
    </div>
  )
}
