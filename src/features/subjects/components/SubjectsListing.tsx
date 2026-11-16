'use client'

import { useState } from 'react'
import { useT } from '@/lib/i18n'
import { Pagination } from '@/components/ui/Pagination'
import { SearchIcon } from '@/components/ui/Icons'
import { ErrorState } from '@/components/ui/ErrorState'
import { CoursesGrid } from '@/features/courses/components/CoursesGrid'
import { useSubjects } from '../hooks/useSubjects'
import { LOCAL_PREVIEW } from '@/lib/preview/catalog'
import { publicStyles as styles } from '@/components/brand/publicStyles'
import { useCourses } from '@/features/courses/hooks/useCourses'

const PER_PAGE = 18

/** Public course search and pagination use the existing API contracts. */
export function SubjectsListing() {
  const { t } = useT()
  const [q, setQ] = useState('')
  const [subject, setSubject] = useState('')
  const { subjects } = useSubjects({ per_page: 30 })
  const [page, setPage] = useState(1)
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000_000) + 1)
  const { courses: loadedCourses, meta, loading, error } = useCourses({ q: q || undefined, page, per_page: PER_PAGE, seed })

  const courses = LOCAL_PREVIEW && subject ? loadedCourses.filter((c) => c.subject.uuid === subject) : loadedCourses
  if (error) {
    return <ErrorState />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex h-11 flex-1 items-center rounded-lg border border-border bg-white px-4">
          <SearchIcon size={18} className="text-text-muted" />
          <input
            className="w-full bg-transparent px-3 text-base outline-none placeholder:text-text-soft"
            aria-label={t('common.searchCourse')}
            placeholder={t('common.searchCourse')}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
          />
        </label>
        {LOCAL_PREVIEW && (
          <select
            aria-label="تصفية حسب المادة"
            className="min-h-11 rounded-lg border border-border bg-white px-4 text-primary"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              setPage(1)
            }}>
            <option value="">كل المواد</option>
            {subjects.map((s) => (
              <option key={s.uuid} value={s.uuid}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="h-[380px] animate-pulse rounded-2xl border border-border bg-white" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <ErrorState title={t('subjects.noCoursesTitle')} message={t('subjects.noCoursesText')} />
      ) : (
        <CoursesGrid courses={courses} className={styles.courseDirectory} />
      )}
      {meta && (
        <div className="relative flex items-center justify-between overflow-hidden rounded-2xl px-2 py-4">
          <span className="relative text-sm text-text-muted">
            {t('common.showing', {
              count: courses.length,
              total: LOCAL_PREVIEW && subject ? courses.length : meta.total,
              label: t('common.subjectsLabel'),
            })}
          </span>
          <Pagination page={page} total={Math.max(1, meta.last_page)} onChange={setPage} className="relative" />
        </div>
      )}
    </div>
  )
}
