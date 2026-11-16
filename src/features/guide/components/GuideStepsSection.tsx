import { LearningPreview } from '@/components/brand/LearningPreview'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function GuideStepsSection() {
  const steps = [
    ['أنشئ حسابك', 'سجّل بياناتك واتبع خطوات التحقق الظاهرة. احتفظ بكلمة المرور ورمز التحقق لنفسك.'],
    ['اختار على بيّنة', 'اقرأ وصف المادة وملف المعلّم، وافتح الوحدات لتشوف المحتوى والدروس المتاحة للمعاينة.'],
    ['راجع خيارات الاشتراك', 'شوف الأسعار حسب منطقتك والباقة المتاحة، واتبع خطوات الدفع والتأكيد الظاهرة في حسابك.'],
    ['ارجع لموادك وكمّل', 'بعد تفعيل الاشتراك، افتح موادي الدراسية وتابع الدروس والمرفقات والاختبارات المتاحة.'],
  ]
  return (
    <section className={styles.section}>
      <div className={styles.container + ' ' + styles.guideLayout}>
        <div>
          <span className={styles.eyebrow}>دليلك لاستخدام الجودي</span>
          <h2 className={styles.title}>
            من حسابك لمادتك.
            <br />
            كل اللي بتحتاج تعرفه.
          </h2>
          <ol className={styles.steps}>
            {steps.map(([title, text], i) => (
              <li className={styles.step} key={title}>
                <span className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <LearningPreview />
      </div>
    </section>
  )
}
