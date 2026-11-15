"use client";

import { useT } from "@/lib/i18n";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PageBanner } from "@/components/layout/PageBanner";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type PrivacySection = { title: string; text: string };

/**
 * The privacy policy, at the public URL the app stores ask for.
 *
 * Google Play and the App Store both require a policy reachable at a plain URL
 * with no sign-in in front of it, and it has to describe what the mobile
 * application actually collects — which is why the sections name the Google
 * sign-in and the notification identifier the phone stores. The copy is the
 * single source for both platforms; keep it in step with the Data safety form
 * in Play Console (`app-mobile/play-store/`).
 */
export default function PrivacyPolicyPage() {
  const { t, raw } = useT();
  const sections = raw<PrivacySection[]>("privacy.sections");

  return (
    <>
      <PublicHeader />
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 md:px-6 md:pb-6 xl:px-0">
        <Breadcrumb items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.privacy") }]} />
      </div>
      <PageBanner
        variant="full"
        title={t("privacy.title")}
        subtitle={t("privacy.subtitle")}
        mascot="/images/mascot-headset@2x.png"
        className="[&>div]:mx-auto [&>div]:max-w-[1120px]"
      />
      <div className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-6 md:py-14 xl:px-0">
        <article className="rounded-2xl border border-border bg-white p-6 md:p-8">
          <p className="text-[11px] font-semibold text-text-muted">{t("privacy.updated")}</p>
          <p className="mt-4 text-sm leading-7 text-text">{t("privacy.intro")}</p>

          <div className="mt-8 flex flex-col gap-7">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-bold text-text-heading">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-text-muted">{section.text}</p>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-xl bg-primary-subtle p-5">
            <h2 className="text-base font-bold text-text-heading">{t("privacy.contactTitle")}</h2>
            <p className="mt-2 text-sm leading-7 text-text">{t("privacy.contactText")}</p>
          </section>
        </article>
      </div>
    </>
  );
}
