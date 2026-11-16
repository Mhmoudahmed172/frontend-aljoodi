'use client'
import Image from 'next/image'
import { useState } from 'react'
import { getSubjectArtwork } from '@/lib/subjectArtwork'
interface CourseCoverProps {
  subject: string
  title?: string
  cover?: string | null
  teacherPhoto?: string | null
  teacherName?: string | null
  minimal?: boolean
}
/** Local photography is shared by cards and detail pages; uploaded covers retain priority. */
export function CourseCover({ subject, title, cover, minimal = false }: CourseCoverProps) {
  const [failed, setFailed] = useState<string[]>([])
  const artwork = getSubjectArtwork(subject)
  const uploaded = cover && !/aljoodi-logo|(?:^|\/)logo\.(png|svg)|mascot-/i.test(cover) ? cover : null
  const src = [uploaded, artwork?.src].find((path): path is string => Boolean(path) && !failed.includes(path!))
  return (
    <div className={`aj-photoCourseCover${minimal ? ' aj-photoCourseCompact' : ''}`}>
      {src ? (
        <Image
          src={src}
          alt={src === artwork?.src ? artwork.alt : (title ?? subject)}
          fill
          loading="lazy"
          sizes="(min-width:1280px) 420px,(min-width:640px) 50vw,100vw"
          onError={() => setFailed((previous) => (previous.includes(src) ? previous : [...previous, src]))}
        />
      ) : (
        <span className="aj-photoCourseMissing">صورة الغلاف غير متاحة حالياً</span>
      )}
      <div className="aj-photoCourseTitle">
        <strong>{subject}</strong>
      </div>
    </div>
  )
}
