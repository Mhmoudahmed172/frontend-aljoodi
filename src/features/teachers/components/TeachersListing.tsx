'use client'

import { publicStyles as styles } from '@/components/brand/publicStyles'
import { useState } from 'react'
import { useT } from '@/lib/i18n'
import { Pagination } from '@/components/ui/Pagination'
import { PillTabs } from '@/components/ui/Tabs'
import { SearchIcon } from '@/components/ui/Icons'
import { ErrorState } from '@/components/ui/ErrorState'
import { useSubjects } from '@/features/subjects/hooks/useSubjects'
import { TeacherCard } from './TeacherCard'
import { useTeachers } from '../hooks/useTeachers'

interface TeachersListingProps {
  basePath: string
  dashboard?: boolean
  columns?: 3 | 4
}

/** Filter row (real `subject` server filter) + teachers grid + pagination, shared by public and dashboard pages. */
export function TeachersListing({ basePath, dashboard = false, columns = 4 }: TeachersListingProps) {
  const { t } = useT()
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const { subjects } = useSubjects({ per_page: 6 })
  const { teachers, meta, loading, error } = useTeachers({
    subject: subjectFilter !== 'all' ? subjectFilter : undefined,
    q: q || undefined,
    page,
  })

  return (
    <div className="flex flex-col gap-6">
      {meta && (
        <p className="text-sm text-text-muted">
          {meta.total.toLocaleString('ar-PS')} ملف معلّم في الكتالوج · افتح الملف لتشوف المواد والتفاصيل المتاحة.
        </p>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex h-11 flex-1 items-center rounded-lg bg-white px-4">
          <SearchIcon size={18} className="text-text-muted" />
          <input
            className="w-full bg-transparent px-3 text-base outline-none placeholder:text-text-soft"
            aria-label={t('common.searchTeacher')}
            placeholder={dashboard ? t('common.search') : t('common.searchTeacher')}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
          />
        </label>
        {dashboard ? (
          <select
            className="h-11 rounded-lg bg-primary px-6 text-base font-bold text-white outline-none"
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value)
              setPage(1)
            }}>
            <option value="all">{t('teachers.allSubjects')}</option>
            {subjects.map((s) => (
              <option key={s.uuid} value={s.uuid}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <PillTabs
            value={subjectFilter}
            onChange={(v) => {
              setSubjectFilter(v)
              setPage(1)
            }}
            items={[{ key: 'all', label: t('common.all') }, ...subjects.map((s) => ({ key: s.uuid, label: s.name }))]}
          />
        )}
      </div>
      {error ? (
        <ErrorState />
      ) : (
        <div
          className={
            !dashboard
              ? styles.teacherShowcase
              : columns === 4
                ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4'
                : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
          }>
          {teachers.map((teacher, i) => (
            <TeacherCard
              key={teacher.uuid}
              teacher={teacher}
              href={`${basePath}/${teacher.uuid}`}
              dashboard={dashboard}
              featured={!dashboard}
              tone={i % 2 === 0 ? 'yellow' : 'blue'}
            />
          ))}
        </div>
      )}
      {!loading && !error && teachers.length === 0 && <ErrorState title={t('teachers.noResultsTitle')} message={t('teachers.noResultsText')} />}
      {/* Rendered in both the public and the dashboard listing — otherwise the dashboard only ever shows page 1. */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-base text-text-muted">
            {t('common.showing', { count: teachers.length, total: meta.total, label: t('common.teachersLabel') })}
          </span>
          <Pagination page={page} total={meta.last_page} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
