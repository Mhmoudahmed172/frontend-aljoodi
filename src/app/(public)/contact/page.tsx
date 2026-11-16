'use client'
import { publicStyles as styles } from '@/components/brand/publicStyles'

import { useT } from '@/lib/i18n'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PageBanner } from '@/components/layout/PageBanner'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ContactSection } from '@/features/contact/components/ContactSection'
import { FaqSection } from '@/features/contact/components/FaqSection'

export default function ContactPage() {
  const { t } = useT()
  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.contact') }]} />
      </div>
      <PageBanner variant="full" title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <div className={styles.container + ' flex flex-col gap-14 py-12'}>
        <ContactSection />
        <FaqSection />
      </div>
    </>
  )
}
