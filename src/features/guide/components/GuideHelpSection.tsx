'use client'
import Link from 'next/link'
import { useT } from '@/lib/i18n'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function GuideHelpSection() {
  const { t } = useT()
  return (
    <section className={styles.support}>
      <div className={styles.container + ' ' + styles.supportInner}>
        <div>
          <h2>واجهتك خطوة مش واضحة؟</h2>
          <p>
            اذكر الصفحة والمادة ووصف المشكلة. تواصل على <a href={'mailto:' + t('footer.email')}>{t('footer.email')}</a> أو من صفحة التواصل.
          </p>
        </div>
        <Link href="/contact" className={styles.actionLight}>
          اسأل فريق الجودي{' '}
          <span data-action-arrow aria-hidden="true">
            ←
          </span>
        </Link>
      </div>
    </section>
  )
}
