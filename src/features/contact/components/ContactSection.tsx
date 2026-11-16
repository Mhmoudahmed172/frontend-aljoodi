'use client'
import Image from 'next/image'
import { demoImages } from '@/lib/preview/catalog'
import { useT } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { MailIcon, PhoneIcon } from '@/components/ui/Icons'
import { useContactForm } from '../hooks/useContactForm'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function ContactSection() {
  const { t } = useT()
  const form = useContactForm()
  return (
    <section className={styles.contactGrid}>
      <div>
        <span className={styles.eyebrow}>خطوتك الجايّة بتبدأ بسؤال</span>
        <h2 className={styles.title}>احكيلنا شو واقف بطريقك.</h2>
        <p className={styles.lead}>
          محتار بأي مادة تبدأ؟ عندك سؤال عن الاشتراك أو استخدام المنصة؟ احكيلنا شو بتحتاج، واذكر التفاصيل اللي بتساعدنا نفهم سؤالك.
        </p>
        <a className={styles.channel} href={'mailto:' + t('contact.emailValue')}>
          <MailIcon size={28} />
          <span>
            <small>البريد الإلكتروني</small>
            <strong dir="ltr">{t('contact.emailValue')}</strong>
          </span>
        </a>
        <a className={styles.channel} href={'tel:' + t('contact.phoneValue')}>
          <PhoneIcon size={28} />
          <span>
            <small>رقم التواصل</small>
            <strong dir="ltr">{t('contact.phoneValue')}</strong>
          </span>
        </a>
        <figure className={styles.supportPhoto}>
          <Image src={demoImages.support} alt="مشهد توضيحي لمساعدة طالبة على استخدام منصة تعليمية" fill sizes="(min-width:768px) 560px,100vw" />
          <figcaption>السؤال أوّل خطوة للوضوح · صورة توضيحية</figcaption>
        </figure>
        <p className="mt-4 text-sm text-text-muted">اذكر المادة والصفحة والخطوة التي تحتاج مساعدة فيها. لا تشارك كلمة المرور أو رمز التحقق.</p>
      </div>
      <form onSubmit={form.submit}>
        <div className="flex flex-col gap-4">
          <Input
            id="name"
            label={t('contact.fullName')}
            placeholder={t('contact.fullNamePlaceholder')}
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
          />
          <Input
            id="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            label={t('contact.mobile')}
            placeholder={t('contact.mobilePlaceholder')}
            value={form.mobile}
            onChange={(e) => form.setMobile(e.target.value)}
            dir="ltr"
            className="text-end"
          />
          <Textarea
            id="message"
            label={t('contact.message')}
            placeholder={t('contact.messagePlaceholder')}
            value={form.message}
            onChange={(e) => form.setMessage(e.target.value)}
          />
          <Button type="submit" fullWidth size="lg" loading={form.loading}>
            {t('contact.sendMessage')}
          </Button>
        </div>
      </form>
    </section>
  )
}
