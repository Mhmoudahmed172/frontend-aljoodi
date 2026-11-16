import Image from 'next/image'
import { demoImages } from '@/lib/preview/catalog'
import { portraits } from '../portraits'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function AboutSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.story}>
          <div>
            <span className={styles.eyebrow}>ليش الجودي؟</span>
            <h2 className={styles.title}>
              تجربة تعليم
              <br />
              بتحترم جهدك.
            </h2>
          </div>
          <div>
            <p>
              التوجيهي إله مكان كبير بحياتك، وكل يوم دراسة بتحطّ فيه من وقتك وجهدك. في الجودي، بنبدأ من احتياجك: معلومة بدها توضيح، سؤال بدّه تطبيق،
              أو موضوع بدك ترجع تراجعه.
            </p>
            <p>
              من ملفات المدرّسين لتفاصيل الدورات، بنجمع المعلومات اللي بتحتاجها لاتخاذ قرارك. اختار المادة المناسبة، تصفّح محتواها، وراجع خيارات
              الاشتراك بدون ما تضيع بين صفحات متفرقة.
            </p>
            <p>
              <strong>معك… حتى القمة.</strong> طموح بنشتغل عليه، بفهم وتدريب ومراجعة.
            </p>
          </div>
        </div>
        <div className={styles.editorialGrid}>
          <figure className={styles.contextPhoto}>
            <Image src={demoImages.teaching} alt="مشهد تعليمي توضيحي لشرح مسألة هندسية" fill sizes="(min-width:768px) 600px,100vw" />
            <figcaption>من الفكرة للتطبيق · مشهد تعليمي توضيحي</figcaption>
          </figure>
          <div>
            <span className={styles.eyebrow}>التعلّم اللي بتشارك فيه</span>
            <h2 className={styles.title}>
              اسأل عن السبب.
              <br />
              وجرّب الحل بنفسك.
            </h2>
            <p className={styles.lead}>
              المثال المحلول بيساعدك تشوف طريقة التفكير. خذ وقتك مع السؤال، راجع الشرح اللي احتجته، وجرّب تطبيق الفكرة على مسألة ثانية.
            </p>
          </div>
        </div>
        <div className={styles.teamStrip}>
          {portraits.map((src) => (
            <div className={styles.portrait} key={src}>
              <Image src={src} alt="صورة مقدّمة من فريق الجودي" fill sizes="(min-width:768px) 290px,45vw" />
            </div>
          ))}
        </div>
        <div className={styles.teamCaption}>
          <span>من فريق الجودي التعليمي</span>
          <span>المعلّم، والمحتوى، والتطبيق.</span>
        </div>
        <div className={styles.principles}>
          <div>
            <h3>اختار البداية المناسبة إلك</h3>
            <p>اقرأ وصف الدورة، راجع وحداتها، وتعرّف على طريقة المعلّم قبل ما تختار.</p>
          </div>
          <div>
            <h3>راجع بتركيز وكمّل بوضوح</h3>
            <p>الوحدات والدروس والاختبارات والمرفقات المتاحة بتعطيك مسار ترجع إله، وتكمّل منه وقت ما تحتاج.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
