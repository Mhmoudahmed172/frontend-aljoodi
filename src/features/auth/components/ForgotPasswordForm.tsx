"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Captcha } from "@/components/ui/Captcha";
import { Input } from "@/components/ui/Input";
import { useForgotPassword } from "../hooks/useAuthForms";

export function ForgotPasswordForm() {
  const { t } = useT();
  const { captchaRef, ...form } = useForgotPassword();
  return (
    <form onSubmit={form.submit} className="flex flex-col gap-5">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-primary-subtle">
          <Image src="/images/lock-icon.png" alt="" width={72} height={72} />
        </span>
        <h1 className="mt-4 text-[26px] font-black text-text-heading">{t("auth.forgotTitle")}</h1>
        <p className="mt-1 text-xs text-text-muted">{t("auth.forgotSubtitle")}</p>
      </div>
      <Input id="phone" label={t("auth.phoneHint")} placeholder={t("auth.phonePlaceholder")} value={form.phone} onChange={(e) => form.setPhone(e.target.value)} dir="ltr" className="text-end" />
      <Captcha ref={captchaRef} onVerify={form.setCaptchaToken} onExpire={() => form.setCaptchaToken(undefined)} />
      <Button type="submit" fullWidth size="lg" loading={form.loading}>
        {t("common.send")}
      </Button>
    </form>
  );
}
