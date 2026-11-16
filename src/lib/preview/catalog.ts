import type { TeacherDetail } from '@/features/teachers/types/teacher.types'
import type { SubjectDetail, SubjectTeacher, Unit } from '@/features/subjects/types/subject.types'
import type { CourseCard } from '@/features/courses/types/course.types'

/** Explicit local opt-in; auth, user, payment and video responses are never substituted. */
export const LOCAL_PREVIEW = process.env.NEXT_PUBLIC_LOCAL_PREVIEW_FIXTURES === 'true'
export const isDemoId = (id: string) => id.startsWith('demo-')
export const previewTeacherLabel = (id: string) => (isDemoId(id) ? 'ملف توضيحي' : 'الاسم غير متوفّر')
export const demoImages = {
  study: '/images/demo/study-scene.png',
  teaching: '/images/demo/teaching-scene.png',
  support: '/images/demo/support-scene.png',
  samer: '/images/demo/samer-illustrative.png',
  layan: '/images/demo/layan-illustrative.png',
} as const

const people = [
  {
    key: 'samer',
    name: 'سامر الخطيب',
    photo: demoImages.samer,
    title: 'الرياضيات والفيزياء',
    subtitle: 'افهم ليش استخدمنا القانون، ودرّب حالك تعرف متى تستخدمه.',
    bio: 'بنبدأ من معنى السؤال: شو المعطيات، وشو المطلوب، ومن وين بنبلّش؟ نفكّك المثال لخطوات، ونوضح سبب كل خطوة، وبعدها دورك تجرّب. الهدف إنك تبني طريقة تفكير ترجع إلها مع السؤال الجاي.',
  },
  {
    key: 'layan',
    name: 'ليان منصور',
    photo: demoImages.layan,
    title: 'الكيمياء والأحياء',
    subtitle: 'لما تربط المفاهيم ببعضها، بتصير الصورة أوضح والمراجعة أرتب.',
    bio: 'من الذرّة للخلية، كل مفهوم إله علاقة باللي قبله واللي بعده. بنرتّب الفكرة، نربطها بمثال، ونراجعها بسؤال قصير. هيك بتعرف وين فهمك واضح، ووين بدك ترجع تشتغل على نقطة معيّنة.',
  },
]
const definitions = [
  {
    key: 'math',
    name: 'الرياضيات',
    title: 'الرياضيات — الفهم والتطبيق',
    person: 0,
    description: 'من معنى المشتقة إلى خطوات الحل: افهم العلاقة، تابع مثالاً، ثم اختبر فهمك بسؤال.',
    units: ['النهايات والاتصال', 'الاشتقاق وتطبيقاته', 'مقدّمة في التكامل'],
    count: 4,
    prices: { first: '120', second: '130', both: '220' },
  },
  {
    key: 'physics',
    name: 'الفيزياء',
    title: 'الفيزياء — من الفكرة إلى القانون',
    person: 0,
    description: 'اقرأ المسألة، حدّد المعطيات، واختر القانون بناءً على معنى الظاهرة.',
    units: ['الحركة والسرعة', 'القوة والطاقة'],
    count: 3,
    prices: { first: '110', second: '120', both: '200' },
  },
  {
    key: 'chemistry',
    name: 'الكيمياء',
    title: 'الكيمياء — روابط وتفاعلات',
    person: 1,
    description: 'ابنِ فهمك للبنية الذرية والروابط، واربطها بسلوك المواد وتفاعلاتها.',
    units: ['البنية الذرية', 'الروابط الكيميائية', 'فهم التفاعلات'],
    count: 3,
    prices: { first: '120', second: '120', both: '210' },
  },
  {
    key: 'biology',
    name: 'الأحياء',
    title: 'الأحياء — افهم الصورة كاملة',
    person: 1,
    description: 'من الخلية إلى الوراثة، رتّب المفاهيم وشوف كيف ترتبط العمليات الحيوية ببعضها.',
    units: ['الخلية والعمليات الحيوية', 'مبادئ الوراثة'],
    count: 4,
    prices: { first: '100', second: '110', both: '185' },
  },
]
const summary = (index: number): SubjectTeacher => ({
  uuid: `demo-teacher-${people[index].key}`,
  name: people[index].name,
  title: people[index].title,
  bio: people[index].bio,
  photo_url: people[index].photo,
})
export const previewSubjects: SubjectDetail[] = definitions.map((d) => ({
  uuid: `demo-subject-${d.key}`,
  slug: `demo-${d.key}`,
  name: d.name,
  icon_url: null,
  teachers_count: 1,
  teachers: [summary(d.person)],
  courses: [
    {
      uuid: `demo-course-${d.key}`,
      slug: `demo-course-${d.key}`,
      name: d.title,
      subject: { uuid: `demo-subject-${d.key}`, name: d.name, slug: `demo-${d.key}` },
      cover_url: null,
      description: d.description,
      branches: ['scientific'],
      outcomes: ['تفسير المفاهيم الأساسية', 'تتبّع خطوات المثال المحلول', 'تطبيق الفكرة في سؤال مستقل'],
      teachers: [summary(d.person)],
      prices: d.prices,
    },
  ],
}))
export const previewCourses: CourseCard[] = previewSubjects.map((s) => ({
  ...s.courses[0],
  subject: { uuid: s.uuid, name: s.name, slug: s.slug },
  teacher: s.teachers[0],
  teachers: s.teachers,
}))
export const previewTeachers: TeacherDetail[] = people.map((p, index) => ({
  uuid: `demo-teacher-${p.key}`,
  name: p.name,
  title: p.title,
  subtitle: p.subtitle,
  photo_url: p.photo,
  subjects: previewSubjects.filter((_, i) => definitions[i].person === index).map((s) => ({ uuid: s.uuid, name: s.name, slug: s.slug })),
  stats: {
    students_count: 0,
    lessons_count: definitions.filter((d) => d.person === index).reduce((n, d) => n + d.units.length * d.count, 0),
    ratings_avg: '0',
    ratings_count: 0,
  },
  bio: `<p>${p.bio}</p><p>هذه السيرة والصورة توضيحيتان، ولا تمثّلان معلّماً حقيقياً أو مؤهلات موثّقة.</p>`,
  features: ['شرح الفكرة قبل التطبيق', 'أمثلة متدرجة وأسئلة للمراجعة'],
  gallery: [],
  courses: previewSubjects.filter((_, i) => definitions[i].person === index).flatMap((s) => s.courses),
}))
const lessonNames = ['الفكرة الأساسية', 'قراءة المثال المحلول', 'خطوات الحل', 'تدريب ومراجعة']
export const previewUnitsBySubject: Record<string, Unit[]> = Object.fromEntries(
  definitions.map((d) => [
    `demo-${d.key}`,
    d.units.map((title, i) => ({
      uuid: `demo-unit-${d.key}-${i + 1}`,
      number: i + 1,
      title,
      semester: i === 0 ? 'first' : 'second',
      lessons: Array.from({ length: d.count }, (_, j) => ({
        uuid: `demo-lesson-${d.key}-${i + 1}-${j + 1}`,
        title: `${title} — ${lessonNames[j]}`,
        duration_seconds: (18 + i * 3 + j * 2) * 60,
        duration: `${18 + i * 3 + j * 2}:00`,
        is_free: j === 0,
        has_video: false,
        cover_url: null,
        is_unlocked: true,
        files_count: 0,
        files: [],
        quiz: null,
        locked_by_quiz: null,
      })),
    })),
  ]),
)
export const demoExercises: Record<string, { explanation: string; question: string; options: string[]; correct: number; feedback: string }> = {
  math: {
    explanation: 'عندما تكون الدالة f(x) = x²، تكون مشتقتها f′(x) = 2x. المشتقة تصف معدل التغيّر عند نقطة.',
    question: 'ما قيمة f′(3)؟',
    options: ['٣', '٦', '٩'],
    correct: 1,
    feedback: 'نعوّض x = 3 في 2x، فنحصل على 6.',
  },
  physics: {
    explanation: 'متوسط السرعة يساوي المسافة المقطوعة مقسومة على الزمن المستغرق.',
    question: 'قطع جسم ١٠ أمتار خلال ثانيتين. ما متوسط سرعته؟',
    options: ['٥ م/ث', '١٢ م/ث', '٢٠ م/ث'],
    correct: 0,
    feedback: '١٠ ÷ ٢ = ٥ أمتار في الثانية.',
  },
  chemistry: {
    explanation: 'في الذرّة المتعادلة، يساوي عدد الإلكترونات عدد البروتونات. العدد الذري يعبّر عن عدد البروتونات.',
    question: 'ذرّة متعادلة عددها الذري ٦. كم إلكتروناً فيها؟',
    options: ['٣', '٦', '١٢'],
    correct: 1,
    feedback: 'الذرّة متعادلة، لذلك فيها ٦ إلكترونات و٦ بروتونات.',
  },
  biology: {
    explanation: 'تحدث مراحل من التنفّس الخلوي في الميتوكوندريا، ويساهم ذلك في إنتاج ATP الذي تستخدمه الخلية.',
    question: 'أي عضية ترتبط بإنتاج ATP عبر التنفّس الخلوي؟',
    options: ['جهاز غولجي', 'الميتوكوندريا', 'النواة'],
    correct: 1,
    feedback: 'الميتوكوندريا موقع رئيسي لإنتاج ATP عبر التنفّس الخلوي.',
  },
}
function paginate<T>(rows: T[], params: Record<string, unknown>) {
  const perPage = Math.max(1, Number(params.per_page) || 12)
  const page = Math.max(1, Number(params.page) || 1)
  return {
    items: rows.slice((page - 1) * perPage, page * perPage),
    meta: { current_page: page, last_page: Math.max(1, Math.ceil(rows.length / perPage)), per_page: perPage, total: rows.length },
  }
}
/** Public read-only catalog whitelist. Unknown endpoints retain the real service. */
export function getPreviewFixture(path: string, params: Record<string, unknown> = {}): unknown {
  const q = String(params.q ?? '').trim()
  if (path === '/api/v1/teachers')
    return paginate(
      previewTeachers.filter(
        (t) => (!q || `${t.name} ${t.title}`.includes(q)) && (!params.subject || t.subjects.some((s) => s.uuid === params.subject)),
      ),
      params,
    )
  if (path === '/api/v1/subjects')
    return paginate(
      previewSubjects.filter((s) => !q || s.name.includes(q)),
      params,
    )
  if (path === '/api/v1/courses')
    return paginate(
      previewCourses.filter(
        (c) =>
          (!q || c.name.includes(q)) &&
          (!params.subject || c.subject.uuid === params.subject) &&
          (!params.branch || c.branches.includes(String(params.branch))),
      ),
      params,
    )
  const teacher = previewTeachers.find((t) => path === `/api/v1/teachers/${t.uuid}`)
  if (teacher) return teacher
  const subject = previewSubjects.find((s) => path === `/api/v1/subjects/${s.slug}`)
  if (subject) return subject
  const unitsSubject = previewSubjects.find((s) => path === `/api/v1/subjects/${s.slug}/units`)
  if (unitsSubject)
    return { items: !params.course || unitsSubject.courses.some((c) => c.slug === params.course) ? previewUnitsBySubject[unitsSubject.slug] : [] }
  if (path === '/api/v1/faqs')
    return {
      items: [
        {
          uuid: 'demo-faq-1',
          question: 'كيف أختار المادة المناسبة؟',
          answer: 'تصفّح المواد، واستخدم البحث أو الفلتر. افتح الدورة لتقرأ الوصف ومحتوى الوحدات وخيارات الاشتراك قبل اختيارك.',
        },
        {
          uuid: 'demo-faq-2',
          question: 'هل أقدر أجرّب درساً؟',
          answer: 'افتح أي درس في الكتالوج التجريبي لتشاهد مثالاً قصيراً وتجاوب على سؤال محلي. لا توجد فيديوهات تعليمية فعلية في هذه النسخة.',
        },
        {
          uuid: 'demo-faq-3',
          question: 'ماذا يحدث عند تجربة الاشتراك؟',
          answer: 'تظهر مراجعة للباقة ثم تأكيد محلي. الأسعار أمثلة للعرض فقط، ولا يُنشأ اشتراك أو طلب دفع.',
        },
        {
          uuid: 'demo-faq-4',
          question: 'هل تُرسل رسالة التواصل؟',
          answer: 'في المعاينة يظهر تأكيد تجريبي فقط، ولا تُرسل الرسالة أو تُحفظ على الخادم.',
        },
        {
          uuid: 'demo-faq-5',
          question: 'هل بيانات المدرّسين حقيقية؟',
          answer:
            'الملفات المسماة في الكتالوج شخصيات افتراضية بصور توضيحية. الصور الأصلية المقدّمة من الجودي تظهر منفصلة دون إسناد أسماء أو تخصصات غير موثّقة.',
        },
      ],
    }
  return undefined
}
