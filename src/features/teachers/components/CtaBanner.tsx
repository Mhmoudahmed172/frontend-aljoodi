import Link from 'next/link'
import { publicStyles as styles } from '@/components/brand/publicStyles'
import { SummitBanner } from '@/components/brand/SummitBanner'
export function CtaBanner({ compact = false }: { compact?: boolean }) {
  if (compact) return <SummitBanner />
  return (
    <section className={styles.support}>
      <div className={styles.container + ' ' + styles.supportInner}>
        <div>
          <h2>جاهز تعطي دراستك دفعة؟</h2>
          <p>استكشف المواد، تعرّف على المدرّسين، وشوف محتوى الدورة قبل الاشتراك. عندك سؤال عن الاختيار؟ احكي معنا.</p>
        </div>
        <div className={styles.actions}>
          <Link className={styles.actionLight} href="/subjects">
            اختار مادتك{' '}
            <span data-action-arrow aria-hidden="true">
              ←
            </span>
          </Link>
          <Link className={styles.actionOutline} href="/contact">
            عندك سؤال؟ احكي معنا
          </Link>
        </div>
      </div>
    </section>
  )
}
