"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Captcha } from "@/components/ui/Captcha";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MapPinIcon } from "@/components/ui/Icons";
import { useRegister } from "../hooks/useAuthForms";
import type { Region } from "../types/auth.types";
import { SocialLogin } from "./SocialLogin";

export function RegisterForm() {
  const { t } = useT();
  // Pull the captcha ref out so the rest of the form state isn't treated as a ref by the React compiler lint.
  const { captchaRef, ...form } = useRegister();
  const regions: Region[] = ["westBank", "gaza"];

  return (
    <form onSubmit={form.submit} className="flex flex-col gap-3">
      <Input id="name" label={t("auth.nameHint")} placeholder={t("auth.namePlaceholder")} value={form.name} onChange={(e) => form.setName(e.target.value)} />
      <Input id="phone" label={t("auth.phoneHint")} placeholder={t("auth.phonePlaceholder")} value={form.phone} onChange={(e) => form.setPhone(e.target.value)} dir="ltr" className="text-end" />
      <PasswordInput id="password" label={t("auth.passwordHint")} placeholder={t("auth.passwordPlaceholder")} value={form.password} onChange={(e) => form.setPassword(e.target.value)} dir="ltr" className="text-end" />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-text-heading">{t("auth.region")}</span>
        <div className="grid grid-cols-2 gap-3">
          {regions.map((r) => {
            const active = form.region === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => form.setRegion(r)}
                className={cn("flex h-12 items-center justify-between rounded-full border border-border bg-white px-4 text-xs", active ? "text-text" : "text-text-muted")}
              >
                <span className="flex items-center gap-1.5">
                  <MapPinIcon size={14} className="text-text-muted" />
                  {t(`auth.${r}`)}
                </span>
                <span className={cn("flex size-4 items-center justify-center rounded-full border", active ? "border-primary" : "border-border-strong")}>
                  {active && <span className="size-2.5 rounded-full bg-primary" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <Checkbox id="agree" label={t("auth.agreeTerms")} checked={form.agree} onChange={(e) => form.setAgree(e.target.checked)} />
      <Captcha ref={captchaRef} onVerify={form.setCaptchaToken} onExpire={() => form.setCaptchaToken(undefined)} />
      <Button type="submit" fullWidth size="lg" loading={form.loading}>
        {t("auth.registerButton")}
      </Button>
      <SocialLogin footerText={t("auth.haveAccount")} footerLinkText={t("auth.loginButton")} footerHref={form.loginHref} />

      {/* The mobile already has an account: offer to log in with the number pre-filled. */}
      <Modal open={form.alreadyRegistered} onClose={form.dismissAlreadyRegistered} className="max-w-[440px] pt-12 text-center">
        <h2 className="text-lg font-black text-text-heading">{t("auth.alreadyRegisteredTitle")}</h2>
        <p className="mt-2 text-xs leading-5 text-text-muted">{t("auth.alreadyRegisteredText", { mobile: form.phone })}</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button className="h-10 rounded-lg text-xs" onClick={form.goLogin}>
            {t("auth.loginButton")}
          </Button>
          <Button variant="outline" className="h-10 rounded-lg bg-surface text-xs" onClick={form.dismissAlreadyRegistered}>
            {t("common.cancel")}
          </Button>
        </div>
      </Modal>
    </form>
  );
}
