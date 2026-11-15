"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/Input";
import { CheckIcon } from "@/components/ui/Icons";
import { useResetPassword } from "../hooks/useAuthForms";

export function ResetPasswordForm() {
  const { t } = useT();
  const form = useResetPassword();

  return (
    <>
      <form onSubmit={form.submit} className="flex flex-col gap-5">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-24 items-center justify-center rounded-full bg-primary-subtle">
            <Image src="/images/lock-icon.png" alt="" width={72} height={72} />
          </span>
          <h1 className="mt-4 text-[26px] font-black text-text-heading">{t("auth.resetTitle")}</h1>
        </div>
        <PasswordInput id="password" label={t("auth.newPassword")} placeholder={t("auth.passwordPlaceholder")} value={form.password} onChange={(e) => form.setPassword(e.target.value)} dir="ltr" className="text-end" />
        <PasswordInput id="confirm" label={t("auth.confirmNewPassword")} placeholder="**************" value={form.confirm} onChange={(e) => form.setConfirm(e.target.value)} dir="ltr" className="text-end" />
        <Button type="submit" fullWidth size="lg" loading={form.loading}>
          {t("common.confirm")}
        </Button>
      </form>
      {form.done && <SuccessOverlay title={t("auth.resetSuccessTitle")} text={t("auth.resetSuccessSubtitle")} cta={t("auth.goToLogin")} href="/login" />}
    </>
  );
}

interface SuccessOverlayProps {
  title: string;
  text: string;
  cta: string;
  href?: string;
  onCta?: () => void;
}

/** Success dialog with green check, confetti and the mascot peeking from the top. */
export function SuccessOverlay({ title, text, cta, href, onCta }: SuccessOverlayProps) {
  const button = (
    <Button fullWidth size="lg" onClick={onCta}>
      {cta}
    </Button>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 px-6 backdrop-blur-sm">
      <div className="relative w-full max-w-[520px] rounded-2xl bg-white px-8 pb-8 pt-10 text-center shadow-card">
        <Image src="/images/mascot-peek@2x.png" alt="" width={180} height={156} className="absolute -top-28 left-1/2 w-44 -translate-x-1/2" />
        <Image src="/images/confetti.png" alt="" width={375} height={236} className="pointer-events-none absolute inset-x-0 top-2 mx-auto w-full opacity-90" />
        <span className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon size={40} strokeWidth={3} />
        </span>
        <h2 className="relative mt-5 text-[26px] font-black text-text-heading">{title}</h2>
        <p className="relative mt-1 text-xs text-text-muted">{text}</p>
        <div className="relative mt-6">{href ? <Link href={href}>{button}</Link> : button}</div>
      </div>
    </div>
  );
}
