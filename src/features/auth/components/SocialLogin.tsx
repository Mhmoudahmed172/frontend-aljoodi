"use client";

import Link from "next/link";
import Script from "next/script";
import { useT } from "@/lib/i18n";
import { GoogleIcon } from "@/components/ui/Icons";
import { useGoogleLogin } from "../hooks/useAuthForms";

interface SocialLoginProps {
  footerText: string;
  footerLinkText: string;
  footerHref: string;
}

const GSI_SRC = "https://accounts.google.com/gsi/client";

/**
 * "or" divider + "continue with Google" button + switch-form footer. The Google button uses the Identity Services
 * OAuth2 token client (popup) and hands the access token to `POST /auth/google`, which logs in or registers the
 * student. Always rendered; the client id has a built-in default (see `useGoogleLogin`).
 */
export function SocialLogin({ footerText, footerLinkText, footerHref }: SocialLoginProps) {
  const { t } = useT();
  const google = useGoogleLogin();

  return (
    <>
      <Script src={GSI_SRC} strategy="afterInteractive" onLoad={google.markReady} />
      <div className="my-1 flex items-center gap-3 text-[11px] text-text-muted">
        <span className="h-px flex-1 bg-border" />
        {t("common.or")}
        <span className="h-px flex-1 bg-border" />
      </div>
      <button
        type="button"
        onClick={google.start}
        disabled={google.loading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-white text-xs font-semibold text-text transition hover:bg-surface disabled:cursor-wait disabled:opacity-70"
      >
        <GoogleIcon size={20} />
        {google.loading ? t("common.loading") : t("auth.googleLogin")}
      </button>
      <p className="mt-3 text-center text-[11px] font-semibold text-text">
        {footerText}{" "}
        <Link href={footerHref} className="font-bold text-primary">
          {footerLinkText}
        </Link>
      </p>
    </>
  );
}
