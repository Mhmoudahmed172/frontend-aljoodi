import { toApiResponse, type ApiResponse } from "@/lib/axios";
import { api } from "@/lib/api";
import type { AuthSession, AuthUser, LoginPayload, OtpPurpose, OtpResetTokenResult, RegisterPayload, RegisterResult, Region } from "../types/auth.types";

/** UI region choice -> backend `RegionEnum` value. */
const REGION_MAP: Record<Region, string> = {
  westBank: "west_bank",
  gaza: "gaza",
};

/**
 * Persists a Passport session (from `/auth/login` or an OTP-verify auto-login response) into the
 * httpOnly session cookie via the BFF route handler. The access token never touches client JS
 * beyond this one hand-off — it isn't stored, returned, or read back from here.
 *
 * @param session
 * @param remember `false` makes the cookie a browser-session cookie (dropped when the browser closes);
 *                 `true` (default — Google / OTP logins) keeps it until the token's `expires_at`.
 */
async function persistSession(session: AuthSession, remember = true): Promise<void> {
  const response = await fetch("/api/session/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: session.access_token, expires_at: session.expires_at, remember }),
  });

  if (!response.ok) {
    throw new Error("تعذّر إنشاء الجلسة");
  }
}

/** `POST /auth/login {mobile, password}` -> on success, persists the session cookie (persistent only with "remember me") and returns the user. */
export function login(payload: LoginPayload): Promise<ApiResponse<AuthUser>> {
  return toApiResponse(
    (async () => {
      const session = await api.post<AuthSession>("/api/auth/login", {
        mobile: payload.phone,
        password: payload.password,
      });
      await persistSession(session, payload.remember);

      return session.user;
    })(),
  );
}

/** `POST /auth/google {access_token}` -> logs in (or registers on first sign-in), persists the session cookie and returns the user. */
export function loginWithGoogle(accessToken: string): Promise<ApiResponse<AuthUser>> {
  return toApiResponse(
    (async () => {
      const session = await api.post<AuthSession>("/api/auth/google", { access_token: accessToken });
      await persistSession(session);

      return session.user;
    })(),
  );
}

/** `POST /auth/register {name, mobile, password, region, agree, captcha_token}` -> `{mobile}`, not logged in yet (mobile still needs OTP verification). */
export function register(payload: RegisterPayload, captchaToken?: string): Promise<ApiResponse<RegisterResult>> {
  return toApiResponse(
    api.post<RegisterResult>("/api/auth/register", {
      name: payload.name,
      mobile: payload.phone,
      password: payload.password,
      region: REGION_MAP[payload.region],
      agree: payload.agree,
      captcha_token: captchaToken,
    }),
  );
}

/** `POST /auth/password/forgot {mobile, captcha_token}` — always reports success (no account enumeration). */
export function requestReset(mobile: string, captchaToken?: string): Promise<ApiResponse<{ sent: boolean }>> {
  return toApiResponse(api.post<void>("/api/auth/password/forgot", { mobile, captcha_token: captchaToken }).then(() => ({ sent: true })));
}

/** `POST /auth/otp/resend {mobile, purpose, captcha_token}`. Used for both `registration` and `password_reset` OTP screens. */
export function resendOtp(mobile: string, purpose: OtpPurpose, captchaToken?: string): Promise<ApiResponse<{ sent: boolean }>> {
  return toApiResponse(api.post<void>("/api/auth/otp/resend", { mobile, purpose, captcha_token: captchaToken }).then(() => ({ sent: true })));
}

/**
 * `POST /auth/otp/verify {mobile, code, purpose}`.
 * - `registration`: response is `{access_token, expires_at, user}` (auto-login) — the session cookie is persisted here too.
 * - `password_reset`: response is `{reset_token}`, handed back to the caller for `resetPassword()`.
 */
export function verifyOtp(mobile: string, code: string, purpose: OtpPurpose): Promise<ApiResponse<{ verified: boolean; resetToken?: string }>> {
  return toApiResponse(
    (async () => {
      if (purpose === "registration") {
        const session = await api.post<AuthSession>("/api/auth/otp/verify", { mobile, code, purpose });
        await persistSession(session);

        return { verified: true };
      }

      const result = await api.post<OtpResetTokenResult>("/api/auth/otp/verify", { mobile, code, purpose });

      return { verified: true, resetToken: result.reset_token };
    })(),
  );
}

/** `POST /auth/password/reset {mobile, reset_token, password}`. */
export function resetPassword(mobile: string, resetToken: string, password: string): Promise<ApiResponse<{ updated: boolean }>> {
  return toApiResponse(api.post<void>("/api/auth/password/reset", { mobile, reset_token: resetToken, password }).then(() => ({ updated: true })));
}
