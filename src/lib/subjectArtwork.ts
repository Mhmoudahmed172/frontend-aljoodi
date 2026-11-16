/** Locally generated Al Joudi photography series. Covers every subject in the preview catalog. */
export const subjectArtwork = {
  math: { src: '/images/course-covers/mathematics-geometry.png', alt: 'مجسّمات هندسية وأدوات إنشاء رياضي بإضاءة بترولية وتفاصيل ذهبية' },
  physics: { src: '/images/course-covers/physics-optics.png', alt: 'تجربة بصريات بمنشور زجاجي وانكسار الضوء' },
  chemistry: { src: '/images/course-covers/chemistry-laboratory.png', alt: 'أدوات مختبر زجاجية ونموذج لبنية جزيئية' },
  biology: { src: '/images/course-covers/biology-cellular.png', alt: 'تفاصيل مجهرية لخلايا نباتية وبنية حيوية' },
} as const
export function getSubjectArtwork(subject: string) {
  if (/رياض|math/i.test(subject)) return subjectArtwork.math
  if (/فيز|phys/i.test(subject)) return subjectArtwork.physics
  if (/كيم|chem/i.test(subject)) return subjectArtwork.chemistry
  if (/أحياء|احياء|biology/i.test(subject)) return subjectArtwork.biology
  return undefined
}
