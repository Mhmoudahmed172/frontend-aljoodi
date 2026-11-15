/** UI-facing region choice; mapped to the backend's `RegionEnum` (`west_bank`|`gaza`) in `authService`. */
export type Region = "westBank" | "gaza";

/** `purpose` values accepted by `POST /auth/otp/verify` and `/auth/otp/resend`. */
export type OtpPurpose = "registration" | "password_reset";

export interface LoginPayload {
  phone: string;
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  region: Region;
  agree: boolean;
}

/** Shape returned by `POST /auth/register` — the account exists but isn't verified/logged-in yet. */
export interface RegisterResult {
  mobile: string;
}

/** Shape returned by `POST /auth/otp/verify` for `purpose=password_reset`. */
export interface OtpResetTokenResult {
  reset_token: string;
}

/** Matches `App\Http\Resources\Api\User\UserResource` on the backend. */
export interface AuthUser {
  uuid: string;
  name: string;
  /** Null for accounts created through Google sign-in until the student adds a number. */
  mobile: string | null;
  email: string | null;
  region: string | null;
  branch: string | null;
  avatar_url: string | null;
  roles: string[];
  permissions: string[];
  mobile_verified: boolean;
  /** Saved notification toggles (backend flag names); keys missing = never changed by the student. */
  notification_preferences?: Partial<Record<"new_subscriptions" | "lesson_reminders" | "payment_updates" | "promotions" | "sms_notifications" | "email_notifications", boolean>>;
}

/** `{access_token, expires_at, user}` — returned by `POST /auth/login` and by OTP-verify auto-login. */
export interface AuthSession {
  access_token: string;
  expires_at: string;
  user: AuthUser;
}
