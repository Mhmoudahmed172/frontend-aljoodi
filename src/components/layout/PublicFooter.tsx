'use client'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { useT } from '@/lib/i18n'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function PublicFooter() {
  const { t } = useT()
  const groups = [
    {
      title: 'ابدأ من هنا',
      links: [
        ['المدرّسون', '/teachers'],
        ['المواد الدراسية', '/subjects'],
        ['دليل المنصة', '/guide'],
      ],
    },
    {
      title: 'عن الجودي',
      links: [
        ['قصتنا', '/about'],
        ['تواصل معنا', '/contact'],
        ['حسابك', '/login'],
      ],
    },
    {
      title: 'تواصل',
      links: [
        [t('footer.email'), 'mailto:' + t('footer.email')],
        [t('footer.phone'), 'tel:' + t('footer.phone')],
        [t('footer.address'), '/contact'],
      ],
    },
    {
      title: 'معلومات',
      links: [
        [t('footer.privacy'), '/privacy-policy'],
        [t('footer.terms'), '/about'],
      ],
    },
  ]
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerIntro}>
            <Logo white width={158} />
            <p>لطلاب التوجيهي الفلسطيني. مدرّسون، مواد منظّمة، وشرح تستكشفه قبل الاشتراك. معك… حتى القمة.</p>
          </div>
          <div className={styles.footerColumns}>
            {groups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                {group.links.map(([label, href]) => (
                  <Link key={label} href={href} dir="auto">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.copyright}>
          <span>{t('footer.copyright')}</span>
          <span>معك… حتى القمة</span>
        </div>
      </div>
    </footer>
  )
}
