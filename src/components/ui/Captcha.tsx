"use client";

import { forwardRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

/**
 * Cloudflare Turnstile widget, gating the SMS-sending auth endpoints (register, forgot-password,
 * OTP resend). Renders nothing when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset, so local setups
 * without a configured widget still work if the backend also has `CAPTCHA_ENABLED=false`.
 */
export const Captcha = forwardRef<TurnstileInstance, CaptchaProps>(function Captcha({ onVerify, onExpire }, ref) {
  if (!SITE_KEY) return null;

  return (
    <Turnstile
      ref={ref}
      siteKey={SITE_KEY}
      onSuccess={onVerify}
      onExpire={onExpire}
      options={{ theme: "light" }}
      className="mx-auto"
    />
  );
});
