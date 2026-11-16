'use client'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { demoExercises } from '@/lib/preview/catalog'
import type { LessonMini } from '../types/subject.types'

export function DemoLessonPreview({ lesson, onClose }: { lesson: LessonMini; onClose: () => void }) {
  const [answer, setAnswer] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const exercise = demoExercises[lesson.uuid.split('-')[2]]
  if (!exercise) return null
  return (
    <Modal open onClose={onClose} className="max-w-2xl">
      <p className="mb-2 text-sm font-bold text-primary">مثال تفاعلي توضيحي · بدون فيديو</p>
      <h2 className="mb-5 pe-10 text-2xl font-bold text-text-heading">{lesson.title}</h2>
      <p className="mb-6 leading-8">{exercise.explanation}</p>
      <fieldset className="mb-5 flex flex-col gap-3">
        <legend className="mb-3 text-lg font-bold">{exercise.question}</legend>
        {exercise.options.map((option, i) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
            <input
              type="radio"
              name="demo-answer"
              checked={answer === i}
              onChange={() => {
                setAnswer(i)
                setChecked(false)
              }}
            />
            {option}
          </label>
        ))}
      </fieldset>
      <Button disabled={answer === null} onClick={() => setChecked(true)}>
        تحقّق من إجابتك
      </Button>
      {checked && (
        <p role="status" className="mt-4 rounded-xl bg-primary-tint p-4 leading-7">
          <strong>{answer === exercise.correct ? 'إجابة صحيحة. ' : 'راجع الفكرة وحاول مرة ثانية. '}</strong>
          {exercise.feedback}
        </p>
      )}
      <p className="mt-5 text-sm text-text-muted">مثال أساسي لعرض التفاعل، وليس درساً كاملاً. لا تُحفظ إجابتك أو يُسجّل تقدّم دراسي.</p>
    </Modal>
  )
}
