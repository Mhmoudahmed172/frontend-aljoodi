"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Captcha } from "@/components/ui/Captcha";
import { useOtp } from "../hooks/useAuthForms";

export function OtpForm() {
  const { t } = useT();
  // Pull the captcha ref out so the rest of the form state isn't treated as a ref by the React compiler lint.
  const { captchaRef, ...form } = useOtp(6);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  return (
    <form onSubmit={form.submit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-primary-subtle">
          <OtpPhoneIcon />
        </span>
        <h1 className="mt-6 text-[26px] font-black text-text-heading">{t("auth.otpTitle")}</h1>
        <p className="mt-1 text-xs text-text-muted">{t("auth.otpSubtitle")}</p>
      </div>
      <div className="flex justify-center gap-4" dir="ltr">
        {form.digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            inputMode="numeric"
            maxLength={1}
            onChange={(e) => {
              form.setDigit(i, e.target.value);
              if (e.target.value && i < 5) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
            }}
            className="size-14 rounded-lg border border-border bg-white text-center text-base font-semibold text-text outline-none focus:border-primary"
          />
        ))}
      </div>
      <Button type="submit" fullWidth size="lg" loading={form.loading}>
        {t("common.send")}
      </Button>
      <Captcha ref={captchaRef} onVerify={form.setCaptchaToken} onExpire={() => form.setCaptchaToken(undefined)} />
      <p className="text-center text-xs text-text">
        {t("auth.noCode")}{" "}
        {/* Disabled with a live countdown for 60 s after the screen opens and after each successful resend. */}
        <button
          type="button"
          onClick={form.resend}
          disabled={form.resendIn > 0 || form.resending}
          aria-live="polite"
          className="font-bold text-primary disabled:cursor-not-allowed disabled:text-text-muted"
        >
          {form.resendIn > 0 ? t("auth.resendIn", { seconds: form.resendIn }) : t("auth.resend")}
        </button>
      </p>
    </form>
  );
}

/** Mobile phone / SMS verification icon with ambient stars (Figma UI-46), drawn inline so the circle badge is never empty. */
function OtpPhoneIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="20" y="8" width="24" height="48" rx="5" stroke="var(--color-primary)" strokeWidth="2.4" fill="#FFFFFF" />
      <path d="M28 12h8" stroke="var(--color-primary)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="50" r="1.8" fill="var(--color-primary)" />
      <rect x="24" y="20" width="16" height="12" rx="3" fill="var(--color-primary)" />
      <path d="m27 24 5 3.5 5-3.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 16v6M47 19h6" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 38v4M10 40h4" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="18" r="1.8" fill="var(--color-accent)" />
      <circle cx="52" cy="46" r="1.8" fill="var(--color-accent)" />
    </svg>
  );
}
