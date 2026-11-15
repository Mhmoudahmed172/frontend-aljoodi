"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useT } from "@/lib/i18n";
import { login, loginWithGoogle, register, requestReset, resendOtp, resetPassword, verifyOtp } from "../services/authService";
import type { OtpPurpose, Region } from "../types/auth.types";
import { REDIRECT_PARAM, safeRedirect, withRedirect } from "../utils/redirect";

/** Seconds the "resend code" button stays disabled after the OTP screen opens and after each successful resend. */
const OTP_RESEND_COOLDOWN_SECONDS = 60;

/** Safe same-origin `?redirect=` target of the current auth page (see `utils/redirect`), or `null`. */
function useRedirectTarget(): string | null {
  const searchParams = useSearchParams();

  return safeRedirect(searchParams.get(REDIRECT_PARAM));
}

export function useLogin() {
  const { t } = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useRedirectTarget();
  // `/login?mobile=...` (from the "already registered" prompt on register) pre-fills the number.
  const [phone, setPhone] = useState(() => searchParams.get("mobile") ?? "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  /** True when the backend said no account exists for the mobile — the form offers to register with it. */
  const [notRegistered, setNotRegistered] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return toast.error(t("auth.fillAllFields"));
    setLoading(true);
    const res = await login({ phone, password, remember });
    setLoading(false);
    if (!res.success) {
      if (res.code === "USER_NOT_REGISTERED") return setNotRegistered(true);

      return toast.error(res.error ?? "");
    }
    toast.success(t("auth.loginSuccess"));
    router.push(redirect ?? "/dashboard");
  };

  const goRegister = () => router.push(withRedirect(`/register?mobile=${encodeURIComponent(phone)}`, redirect));

  return { phone, setPhone, password, setPassword, remember, setRemember, loading, submit, notRegistered, dismissNotRegistered: () => setNotRegistered(false), goRegister, registerHref: withRedirect("/register", redirect) };
}

/**
 * Google OAuth web client id. It is a public identifier (not a secret), so the platform's id is the built-in
 * default and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` only overrides it (e.g. for a staging project).
 */
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "133277771300-tuvmqvskcprodknjm3h4p6lrgc10cgk6.apps.googleusercontent.com";

/**
 * "Continue with Google" for both the login and register screens: opens the Google OAuth popup (Identity Services
 * token client), then posts the access token to `POST /auth/google`, which logs the student in or creates the
 * account on first sign-in.
 */
export function useGoogleLogin() {
  const { t } = useT();
  const router = useRouter();
  const redirect = useRedirectTarget();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const finish = async (accessToken: string) => {
    const res = await loginWithGoogle(accessToken);
    setLoading(false);
    if (!res.success) return toast.error(res.error ?? "");
    toast.success(t("auth.loginSuccess"));
    router.push(redirect ?? "/dashboard");
  };

  const start = () => {
    const gsi = typeof window === "undefined" ? undefined : window.google?.accounts.oauth2;
    if (!gsi) return toast.error(t("auth.googleUnavailable"));
    setLoading(true);
    const client = gsi.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (response) => {
        if (!response.access_token) {
          setLoading(false);

          return toast.error(t("auth.googleFailed"));
        }
        void finish(response.access_token);
      },
      error_callback: () => setLoading(false),
    });
    client.requestAccessToken();
  };

  return { ready, markReady: () => setReady(true), loading, start };
}

export function useRegister() {
  const { t } = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useRedirectTarget();
  const [name, setName] = useState("");
  // `/register?mobile=...` (from the "not registered" prompt on login) pre-fills the number.
  const [phone, setPhone] = useState(() => searchParams.get("mobile") ?? "");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState<Region>("westBank");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>();
  const captchaRef = useRef<TurnstileInstance>(null);
  /** True when the backend said the mobile already has an account — the form offers to log in with it. */
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password || !agree) return toast.error(t("auth.fillAllFields"));
    setLoading(true);
    const res = await register({ name, phone, password, region, agree }, captchaToken);
    setLoading(false);
    captchaRef.current?.reset();
    setCaptchaToken(undefined);
    if (!res.success) {
      if (res.code === "MOBILE_ALREADY_REGISTERED") return setAlreadyRegistered(true);

      return toast.error(res.error ?? "");
    }
    toast.success(t("auth.registerSuccess"));
    // Registration doesn't log the user in yet — the mobile has to be OTP-verified first.
    // Carry it (and the purpose) as query params into /verify-otp since these are separate routes.
    router.push(withRedirect(`/verify-otp?mobile=${encodeURIComponent(res.data?.mobile ?? phone)}&purpose=registration`, redirect));
  };

  return { name, setName, phone, setPhone, password, setPassword, region, setRegion, agree, setAgree, loading, submit, captchaRef, setCaptchaToken, alreadyRegistered, dismissAlreadyRegistered: () => setAlreadyRegistered(false), goLogin: () => router.push(withRedirect(`/login?mobile=${encodeURIComponent(phone)}`, redirect)), loginHref: withRedirect("/login", redirect) };
}

export function useForgotPassword() {
  const { t } = useT();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>();
  const captchaRef = useRef<TurnstileInstance>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return toast.error(t("auth.fillAllFields"));
    setLoading(true);
    const res = await requestReset(phone, captchaToken);
    setLoading(false);
    captchaRef.current?.reset();
    setCaptchaToken(undefined);
    if (!res.success) return toast.error(res.error ?? "");
    toast.success(t("auth.codeSent"));
    router.push(`/verify-otp?mobile=${encodeURIComponent(phone)}&purpose=password_reset`);
  };
  return { phone, setPhone, loading, submit, captchaRef, setCaptchaToken };
}

export function useOtp(length = 6) {
  const { t } = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") ?? "";
  const purpose = (searchParams.get("purpose") as OtpPurpose | null) ?? "registration";
  const redirect = useRedirectTarget();
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>();
  const captchaRef = useRef<TurnstileInstance>(null);
  // A code was just sent when this screen opens (register / forgot-password), so the cooldown starts immediately.
  const [resendIn, setResendIn] = useState(OTP_RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((s) => Math.max(0, s - 1)), 1000);

    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const setDigit = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value.replace(/\D/g, "").slice(-1);
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (!mobile) return toast.error(t("auth.fillAllFields"));
    if (code.length < 4) return toast.error(t("auth.fillAllFields"));
    setLoading(true);
    const res = await verifyOtp(mobile, code, purpose);
    setLoading(false);
    if (!res.success) return toast.error(res.error ?? "");
    toast.success(t("auth.otpVerified"));
    if (purpose === "registration") {
      router.push(redirect ?? "/dashboard");
      return;
    }
    router.push(`/reset-password?mobile=${encodeURIComponent(mobile)}&reset_token=${encodeURIComponent(res.data?.resetToken ?? "")}`);
  };

  const resend = async () => {
    if (!mobile || resendIn > 0 || resending) return;
    setResending(true);
    const res = await resendOtp(mobile, purpose, captchaToken);
    setResending(false);
    captchaRef.current?.reset();
    setCaptchaToken(undefined);
    if (!res.success) return toast.error(res.error ?? "");
    setResendIn(OTP_RESEND_COOLDOWN_SECONDS);
    toast.success(t("auth.codeSent"));
  };

  return { digits, setDigit, loading, submit, resend, resendIn, resending, mobile, captchaRef, setCaptchaToken };
}

export function useResetPassword() {
  const { t } = useT();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") ?? "";
  const resetToken = searchParams.get("reset_token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !resetToken) return toast.error(t("auth.fillAllFields"));
    if (!password || !confirm) return toast.error(t("auth.fillAllFields"));
    if (password !== confirm) return toast.error(t("auth.passwordsMismatch"));
    setLoading(true);
    const res = await resetPassword(mobile, resetToken, password);
    setLoading(false);
    if (!res.success) return toast.error(res.error ?? "");
    setDone(true);
  };

  return { password, setPassword, confirm, setConfirm, loading, done, submit };
}
