"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/** Closing support card: email + phone (from `footer.*`) and a link to the contact page. */
export function GuideHelpSection() {
  const { t } = useT();
  const email = t("footer.email");
  const phone = t("footer.phone");
  return (
    <section className="mx-auto w-full max-w-[1120px] px-5 py-12 md:px-6 md:py-16 xl:px-0">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-primary-subtle px-6 py-8 md:px-10 md:py-10">
          <span className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-primary/10" />
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-start">
            <div className="flex items-center gap-5">
              <Image src="/images/mascot-headset@2x.png" alt="" width={120} height={112} className="hidden h-28 w-auto md:block" />
              <div>
                <h2 className="text-xl font-black text-text-heading md:text-2xl">{t("guide.helpTitle")}</h2>
                <p className="section-subtitle mt-2">{t("guide.helpSubtitle")}</p>
                <div className="mt-4 flex flex-col gap-2 text-sm md:flex-row md:gap-6">
                  <a href={`mailto:${email}`} className="flex items-center justify-center gap-2 text-text hover:text-primary md:justify-start">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white text-primary shadow-soft"><MailIcon size={16} /></span>
                    <span className="flex flex-col"><span className="text-xs text-text-muted">{t("guide.helpEmail")}</span><span dir="ltr" className="font-semibold">{email}</span></span>
                  </a>
                  <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 text-text hover:text-primary md:justify-start">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white text-primary shadow-soft"><PhoneIcon size={16} /></span>
                    <span className="flex flex-col"><span className="text-xs text-text-muted">{t("guide.helpPhone")}</span><span dir="ltr" className="font-semibold">{phone}</span></span>
                  </a>
                </div>
              </div>
            </div>
            <Link href="/contact">
              <Button size="lg">{t("guide.helpButton")}</Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
