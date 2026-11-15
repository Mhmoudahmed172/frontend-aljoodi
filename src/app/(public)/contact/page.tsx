"use client";

import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactSection } from "@/features/contact/components/ContactSection";
import { FaqSection } from "@/features/contact/components/FaqSection";

export default function ContactPage() {
  const { t } = useT();
  return (
    <>
      <PublicHeader />
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 md:px-6 md:pb-6 xl:px-0">
        <Breadcrumb items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.contact") }]} />
      </div>
      <PageBanner variant="full" title={t("contact.title")} subtitle={t("contact.subtitle")} mascot="/images/mascot-headset@2x.png" className="[&>div]:mx-auto [&>div]:max-w-[1120px]" />
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-12 px-5 py-10 md:gap-16 md:px-6 md:py-12 xl:px-0">
        <ContactSection />
        <FaqSection />
      </div>
    </>
  );
}
