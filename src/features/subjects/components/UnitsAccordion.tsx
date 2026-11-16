'use client'

import Image from 'next/image'
import { LOCAL_PREVIEW, isDemoId } from '@/lib/preview/catalog'
import { DemoLessonPreview } from './DemoLessonPreview'
import { useState } from 'react'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { AccordionItem } from '@/components/ui/Accordion'
import { ClockIcon, FileIcon, LockIcon, PlayIcon } from '@/components/ui/Icons'
import { useSessionStatus } from '@/features/auth/hooks/useSessionStatus'
import { LessonLockedNotice } from '@/features/quizzes/components/LessonLockedNotice'
import { LessonQuizBadge } from '@/features/quizzes/components/LessonQuizBadge'
import { QuizModal, type QuizLessonRef } from '@/features/quizzes/components/QuizModal'
import { useUnits } from '../hooks/useSubject'
import { LessonFiles } from './LessonFiles'
import { LessonPlayerModal } from './LessonPlayerModal'
import type { LessonMini } from '../types/subject.types'

interface UnitsAccordionProps {
  slug: string
  className?: string
  /** Public page shows all units collapsed. */
  collapsedOnly?: boolean
  /** Slug of the subject's course to show; the first course when omitted. */
  course?: string | null
}

/**
 * Course units accordion with the lesson list (thumbnail, title, free badge, attachments count, duration) and each
 * lesson's files underneath — loaded from `GET /api/v1/subjects/{slug}/units`. Files of free lessons open directly;
 * the rest show as locked until the student subscribes. Lessons with a quiz show a badge + start/result action, and a
 * lesson locked by the previous lesson's required quiz shows a lock notice whose button opens that quiz.
 */
export function UnitsAccordion({ slug, className, collapsedOnly = false, course }: UnitsAccordionProps) {
  const { t } = useT()
  const { units, loading } = useUnits(slug, course)
  const { data: session } = useSessionStatus()
  const authenticated = session?.authenticated === true
  const [demoLesson, setDemoLesson] = useState<LessonMini | null>(null)
  const canPreview = (lesson: LessonMini) => LOCAL_PREVIEW && isDemoId(lesson.uuid)
  const previewLesson = (lesson: LessonMini) => {
    if (canPreview(lesson)) setDemoLesson(lesson)
    else if (lesson.has_video) setPlaying(lesson)
  }
  const [playing, setPlaying] = useState<LessonMini | null>(null)
  const [quizLesson, setQuizLesson] = useState<QuizLessonRef | null>(null)

  const openQuiz = (lesson: QuizLessonRef) => {
    setPlaying(null)
    setQuizLesson({ uuid: lesson.uuid, title: lesson.title })
  }
  const openLesson = (uuid: string) => {
    const lesson = units.flatMap((unit) => unit.lessons).find((item) => item.uuid === uuid)
    if (!lesson) return
    setQuizLesson(null)
    setPlaying(lesson)
  }

  if (!loading && units.length === 0) {
    return <p className={cn('text-sm text-text-muted', className)}>{t('subjects.noSubjectsText')}</p>
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {!loading && units.length > 0 && (
        <p className="text-sm font-semibold text-text-muted">
          {units.length.toLocaleString('ar-PS')} وحدات · {units.reduce((total, unit) => total + unit.lessons.length, 0).toLocaleString('ar-PS')} دروس
          في هذه الدورة
        </p>
      )}
      {units.map((unit, index) => (
        <AccordionItem
          key={unit.uuid}
          defaultOpen={!collapsedOnly && unit.lessons.length > 0}
          headerClassName="bg-primary-tint rounded-xl"
          meta={<span className="text-sm font-semibold text-text">{t('common.lessonCount', { count: unit.lessons.length })}</span>}
          title={
            <>
              <span className="text-sm font-semibold text-primary">{String(unit.number || index + 1).padStart(2, '0')}</span>
              <span>{unit.title}</span>
            </>
          }>
          {unit.lessons.length > 0 && (
            <ul className="flex flex-col gap-3 pt-3">
              {unit.lessons.map((lesson) => (
                <li key={lesson.uuid} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => previewLesson(lesson)}
                        disabled={!lesson.has_video && !canPreview(lesson)}
                        title={
                          !lesson.has_video && !canPreview(lesson)
                            ? t('subjects.lessonNoVideo')
                            : lesson.is_unlocked
                              ? t('subjects.watchLesson')
                              : t('subjects.lessonLocked')
                        }
                        aria-label={lesson.is_unlocked ? t('subjects.watchLesson') : t('subjects.lessonLocked')}
                        className={cn('group relative size-11 shrink-0 overflow-hidden rounded-lg', lesson.has_video && 'cursor-pointer')}>
                        {lesson.cover_url && (
                          <Image
                            src={lesson.cover_url}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="44px"
                          />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex size-5 items-center justify-center rounded-full bg-white/90 text-primary">
                            {lesson.is_unlocked && !lesson.locked_by_quiz ? <PlayIcon size={9} /> : <LockIcon size={9} />}
                          </span>
                        </span>
                      </button>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => previewLesson(lesson)}
                          className={cn('text-start text-base font-semibold text-text-heading', lesson.has_video && 'hover:text-primary')}>
                          {lesson.title}
                        </button>
                        <span className="flex items-center gap-2 text-sm text-text-muted">
                          {lesson.is_free && (
                            <span className="rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success">{t('subjects.freeLesson')}</span>
                          )}
                          {lesson.is_free && (lesson.has_video || canPreview(lesson)) && (
                            <button
                              type="button"
                              onClick={() => previewLesson(lesson)}
                              className="flex items-center gap-1 font-semibold text-primary hover:underline">
                              <PlayIcon size={10} />
                              {canPreview(lesson) ? 'جرّب مثالاً' : t('subjects.watchFree')}
                            </button>
                          )}
                          {lesson.files_count > 0 && (
                            <span className="flex items-center gap-1">
                              <FileIcon size={12} className="text-primary" />
                              {t('subjects.attachmentsCount', { count: lesson.files_count })}
                            </span>
                          )}
                          {lesson.quiz && !lesson.locked_by_quiz && (
                            <LessonQuizBadge quiz={lesson.quiz} authenticated={authenticated} onOpen={() => openQuiz(lesson)} />
                          )}
                          {lesson.quiz && lesson.locked_by_quiz && (
                            <span className="rounded-full bg-primary-subtle px-2 py-0.5 font-semibold text-primary">{t('quizzes.badge')}</span>
                          )}
                        </span>
                      </span>
                    </div>
                    {lesson.duration_seconds > 0 && (
                      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-text" dir="ltr">
                        <ClockIcon size={12} className="text-text-muted" />
                        {lesson.duration}
                      </span>
                    )}
                  </div>
                  {lesson.locked_by_quiz && (
                    <LessonLockedNotice
                      variant="inline"
                      lockedBy={lesson.locked_by_quiz}
                      onOpenQuiz={(locked) => openQuiz({ uuid: locked.lesson_uuid, title: locked.title })}
                      className="ps-14"
                    />
                  )}
                  <LessonFiles files={lesson.files} className="ps-14" />
                </li>
              ))}
            </ul>
          )}
        </AccordionItem>
      ))}
      {demoLesson && <DemoLessonPreview key={demoLesson.uuid} lesson={demoLesson} onClose={() => setDemoLesson(null)} />}
      <LessonPlayerModal slug={slug} course={course} lesson={playing} onClose={() => setPlaying(null)} onOpenQuiz={openQuiz} />
      <QuizModal slug={slug} course={course} lesson={quizLesson} onClose={() => setQuizLesson(null)} onOpenLesson={(next) => openLesson(next.uuid)} />
    </div>
  )
}
