"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CheckCircleSolidIcon, GraduationIcon, PaperPlaneIcon, PlayIcon, PlusIcon, SwirlIcon, TriangleIcon } from "@/components/ui/Icons";

/** Landing hero: header laid over a light teal gradient, copy on the start side, student character on the end side. Stacks on mobile. */
export function HeroSection() {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbfb_0%,#e6f4f6_100%)]">
      <span className="pointer-events-none absolute -end-28 top-24 size-[420px] rounded-full bg-white/60" />
      <span className="pointer-events-none absolute -start-40 bottom-0 h-[380px] w-[560px] rounded-[50%] bg-white/50" />
      <PublicHeader overlay />
      <div className="relative mx-auto grid w-full max-w-[1120px] grid-cols-1 items-end gap-2 px-5 md:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-6 xl:px-0">
        <div className="relative flex flex-col items-start gap-4 pt-6 text-start md:gap-5 md:pb-24 md:pt-10">
          <Reveal>
            <h1 className="relative text-[30px] font-semibold leading-[1.5] text-text-heading md:text-[40px] lg:text-[48px]">
              <Image src="/images/decor-sparkle.png" alt="" width={36} height={30} className="animate-float absolute -top-5 -end-1 w-6 md:-top-7 md:w-8" />
              {t("landing.heroTitle1")} <span className="marker-solid">{t("landing.heroHighlight1")}</span> {t("landing.heroTitle1b")}
              <br />
              {t("landing.heroTitle2")}
              <br />
              {t("landing.heroTitle3")} <span className="marker-solid">{t("landing.heroHighlight2")}</span>
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-sm leading-[1.5] text-text-muted md:text-base">{t("landing.heroSubtitle")}</p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button className="h-11 px-6 text-sm md:h-12 md:min-w-[180px] md:px-8">{t("landing.startFree")}</Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" className="h-11 px-5 text-sm md:h-12 md:min-w-[180px] md:px-6" startIcon={<PlayIcon size={14} />}>
                  {t("landing.meetAljoodi")}
                </Button>
              </Link>
            </div>
          </Reveal>
          <PlusIcon size={14} className="animate-float-slow absolute -end-6 bottom-28 hidden text-accent md:block" />
          <TriangleIcon size={12} className="absolute -end-2 top-16 hidden rotate-90 text-accent md:block" />
          <span className="absolute -end-10 top-24 hidden size-3 rounded-full bg-primary-soft md:block" />
          <SwirlIcon size={20} className="animate-float absolute bottom-6 end-1/3 hidden text-accent md:block" />
        </div>
        <Reveal delay={150} className="relative -me-5 h-[340px] sm:h-[420px] md:-me-6 lg:h-[590px] xl:-me-20">
          <PaperPlaneIcon size={40} strokeWidth={1.3} className="animate-float-slow absolute start-2 top-5 hidden text-primary md:block" />
          <TriangleIcon size={10} className="absolute -end-2 top-16 hidden -rotate-90 text-accent md:block" />
          <span className="absolute end-1/3 top-[64%] size-3 rounded-full bg-white" />
          <PlusIcon size={16} className="animate-float absolute start-1/2 top-20 text-accent" />
          {/* Soft teal backdrop blob with the identity's wave lines. */}
          <div className="absolute inset-x-[4%] bottom-0 top-[8%] overflow-hidden rounded-[46%_54%_40%_60%/55%_45%_55%_45%] bg-[linear-gradient(160deg,#b3dfe3_0%,#66bfc7_55%,#33a9b4_100%)]">
            <svg viewBox="0 0 600 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-50" fill="none" stroke="#fff" strokeLinecap="round">
              <path d="M-20 430c120 70 260 95 420 60s180-90 240-160" strokeWidth="2" />
              <path d="M-20 490c130 60 280 80 440 40s170-80 220-140" strokeWidth="1.5" />
              <path d="M-20 550c140 50 300 60 460 20s160-70 200-120" strokeWidth="1" />
            </svg>
          </div>
          {/* Character: flat-vector student studying with science symbols, in brand teal and ink (unDraw "Studying science", free licence, recoloured). */}
          <Image src="/images/hero-character.svg" alt="" width={960} height={756} className="absolute bottom-0 end-0 h-[78%] w-auto max-w-none object-contain object-bottom" priority unoptimized />
          {/* Lesson card, floating on the start side. */}
          <div className="animate-float absolute start-[2%] top-[6%] w-[42%] max-w-[210px] rounded-2xl bg-white p-2.5 shadow-card sm:p-3 lg:top-[10%]">
            <div className="relative flex h-14 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,#e6f4f6,#cce9ec)] sm:h-[68px]">
              <span className="absolute inset-x-3 bottom-2 h-1 rounded-full bg-white/80">
                <span className="block h-full w-2/3 rounded-full bg-primary" />
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-white shadow-soft">
                <PlayIcon size={13} />
              </span>
            </div>
            <p className="mt-2 truncate text-xs font-bold text-text-heading sm:text-sm">{t("landing.heroVisual.lessonTitle")}</p>
            <p className="mt-0.5 text-[10px] text-text-muted sm:text-[11px]">{t("landing.heroVisual.lessonMeta")}</p>
          </div>
          {/* Subject chips, floating on the end side. */}
          <div className="animate-float-slow absolute end-[2%] top-[42%] hidden w-[38%] max-w-[190px] rounded-2xl bg-white/95 p-3 shadow-card backdrop-blur sm:block">
            <p className="mb-2 text-[10px] font-semibold text-text-muted sm:text-[11px]">{t("landing.heroVisual.subjects")}</p>
            <div className="flex flex-wrap gap-1.5">
              {[t("landing.heroVisual.math"), t("landing.heroVisual.physics"), t("landing.heroVisual.chemistry"), t("landing.heroVisual.biology")].map((subject, i) => (
                <span key={subject} className={i < 2 ? "rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white sm:text-[11px]" : "rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-strong sm:text-[11px]"}>
                  {subject}
                </span>
              ))}
            </div>
          </div>
          {/* Graduation mark in gold. */}
          <div className="animate-float absolute end-[10%] top-[2%] flex size-12 items-center justify-center rounded-2xl bg-accent text-white shadow-card sm:size-14 lg:size-16">
            <GraduationIcon size={26} strokeWidth={1.8} />
          </div>
          <div className="animate-float-slow absolute bottom-[8%] start-[4%] rounded-2xl bg-white px-4 py-3 shadow-card">
            <p className="text-[11px] font-semibold text-text-muted">{t("landing.heroVisual.scoreLabel")}</p>
            <p className="mt-0.5 text-2xl font-bold leading-none text-primary sm:text-3xl" dir="ltr">
              97.4<span className="text-base text-primary-light">%</span>
            </p>
            <span className="mt-2 flex items-center gap-1 text-[11px] font-bold text-success">
              <CheckCircleSolidIcon size={12} />
              {t("landing.heroVisual.improved")}
            </span>
          </div>
          <TriangleIcon size={10} className="absolute bottom-24 start-2 -rotate-90 text-accent" />
        </Reveal>
      </div>
    </section>
  );
}
