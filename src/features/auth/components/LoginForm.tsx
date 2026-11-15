"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useLogin } from "../hooks/useAuthForms";
import { SocialLogin } from "./SocialLogin";

export function LoginForm() {
  const { t } = useT();
  const form = useLogin();
  // `?suspended=1`: the session was dropped because the account was banned or deactivated (see AuthSessionBoundary).
  const suspended = useSearchParams().get("suspended") === "1";

  return (
    <form onSubmit={form.submit} className="flex flex-col gap-3">
      {suspended && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {t("auth.accountSuspended")}
        </p>
      )}
      <Input
        id="phone"
        label={t("auth.phoneHint")}
        placeholder={t("auth.phonePlaceholder")}
        value={form.phone}
        onChange={(e) => form.setPhone(e.target.value)}
        dir="ltr"
        className="text-end"
      />
      <PasswordInput
        id="password"
        label={t("auth.passwordHint")}
        placeholder={t("auth.passwordPlaceholder")}
        value={form.password}
        onChange={(e) => form.setPassword(e.target.value)}
        dir="ltr"
        className="text-end"
      />
      <div className="flex items-center justify-between">
        <Checkbox id="remember" label={t("auth.rememberMe")} checked={form.remember} onChange={(e) => form.setRemember(e.target.checked)} />
        <Link href="/forgot-password" className="text-xs font-bold text-danger">
          {t("auth.forgotPassword")}
        </Link>
      </div>
      <Button type="submit" fullWidth size="lg" loading={form.loading}>
        {t("auth.loginButton")}
      </Button>
      <SocialLogin footerText={t("auth.noAccount")} footerLinkText={t("auth.createAccount")} footerHref={form.registerHref} />

      {/* No account for this mobile: offer to register with the number pre-filled. */}
      <Modal open={form.notRegistered} onClose={form.dismissNotRegistered} className="max-w-[440px] pt-12 text-center">
        <h2 className="text-lg font-black text-text-heading">{t("auth.notRegisteredTitle")}</h2>
        <p className="mt-2 text-xs leading-5 text-text-muted">{t("auth.notRegisteredText", { mobile: form.phone })}</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button className="h-10 rounded-lg text-xs" onClick={form.goRegister}>
            {t("auth.createAccount")}
          </Button>
          <Button variant="outline" className="h-10 rounded-lg bg-surface text-xs" onClick={form.dismissNotRegistered}>
            {t("common.cancel")}
          </Button>
        </div>
      </Modal>
    </form>
  );
}
