'use client'
import { publicStyles as styles } from '@/components/brand/publicStyles'

import Link from 'next/link'
import { useT } from '@/lib/i18n'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { GraduationIcon } from '@/components/ui/Icons'
import { ProfileHero } from '@/features/profile/components/ProfileHero'
import { AccountDetailsCard, usePublicProfileRows } from '@/features/profile/components/AccountDetails'
import { HomeStatCards } from '@/features/dashboard/components/StatCards'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

export default function PublicProfilePage() {
  const { t } = useT()
  const { data: user, isLoading } = useCurrentUser()
  const rows = usePublicProfileRows(user)
  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <Breadcrumb items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.profile') }]} />
      </div>
      <ProfileHero variant="full" showEmail user={user} loading={isLoading} />
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-5 py-8 md:px-6 md:py-10 xl:px-0">
        <HomeStatCards />
        <div className="grid gap-8 md:grid-cols-2">
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-black text-text-heading">
              <span className="marker">{t('profile.mySubjects')}</span>
            </h2>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary bg-primary-faint p-8 text-center">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                <GraduationIcon size={20} />
              </span>
              <p className="text-xs font-bold text-text-heading">{t('subjects.noSubscriptionTitle')}</p>
              <Link href="/subjects">
                <Button className="h-9 text-xs">{t('subjects.exploreSubjects')}</Button>
              </Link>
            </div>
          </section>
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-black text-text-heading">
              <span className="marker">{t('profile.title')}</span>
            </h2>
            <AccountDetailsCard rows={rows} />
          </section>
        </div>
      </div>
    </>
  )
}
