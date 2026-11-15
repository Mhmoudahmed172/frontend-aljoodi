"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import { useContactForm } from "../hooks/useContactForm";

export function ContactSection() {
  const { t } = useT();
  const form = useContactForm();
  return (
    <section className="relative grid gap-10 lg:grid-cols-[1fr_1.3fr]">
      <span className="pointer-events-none absolute -start-4 top-24 size-4 rounded-full bg-primary-soft" />
      <div className="relative flex flex-col items-start gap-3">
        <span className="pointer-events-none absolute -start-8 -top-8 size-9 rounded-full bg-primary-soft" />
        <h2 className="text-[28px] font-black text-text-heading">
          {t("contact.formTitle1")} <span className="marker">{t("contact.formHighlight")}</span>
        </h2>
        <p className="text-xs text-text-muted">{t("contact.formSubtitle")}</p>
        <div className="mt-4 flex flex-col gap-4">
          {[
            { icon: <MailIcon size={16} />, label: t("contact.email"), value: t("contact.emailValue") },
            { icon: <PhoneIcon size={16} />, label: t("contact.phone"), value: t("contact.phoneValue") },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-subtle text-primary">{row.icon}</span>
              <div className="flex flex-col">
                <span className="text-[11px] text-text-muted">{row.label}</span>
                <span className="text-xs font-semibold text-text-heading" dir="ltr">
                  {row.value}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Image src="/images/decor-arrow-dashed.png" alt="" width={64} height={80} className="mt-6 w-24 rotate-180 opacity-70" />
      </div>
      <form onSubmit={form.submit} className="relative rounded-2xl border border-border bg-white p-6">
        <span className="pointer-events-none absolute -start-3 -top-3 size-6 rounded-full bg-primary-soft" />
        <div className="flex flex-col gap-4">
          <Input id="name" label={t("contact.fullName")} placeholder={t("contact.fullNamePlaceholder")} value={form.name} onChange={(e) => form.setName(e.target.value)} />
          <Input
            id="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            label={t("contact.mobile")}
            placeholder={t("contact.mobilePlaceholder")}
            value={form.mobile}
            onChange={(e) => form.setMobile(e.target.value)}
            dir="ltr"
            className="text-end"
          />
          <Textarea id="message" label={t("contact.message")} placeholder={t("contact.messagePlaceholder")} value={form.message} onChange={(e) => form.setMessage(e.target.value)} />
          <Button type="submit" fullWidth size="lg" loading={form.loading}>
            {t("contact.sendMessage")}
          </Button>
        </div>
      </form>
    </section>
  );
}
