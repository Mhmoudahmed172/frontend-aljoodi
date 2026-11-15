import { apiProxy } from "@/lib/api";
import type { AuthUser } from "@/features/auth/types/auth.types";

/** Frontend notification toggle names (see `useSettings`'s `notif` state / `SettingsPage`'s toggle rows). */
export interface NotificationPrefs {
  newLessons: boolean;
  platformAds: boolean;
  requestUpdates: boolean;
  newMessages: boolean;
  contactRequests: boolean;
  mentions: boolean;
}

/** `POST /user/v1/settings/notifications` request shape. */
interface NotificationSettingsPayload {
  new_subscriptions?: boolean;
  lesson_reminders?: boolean;
  payment_updates?: boolean;
  promotions?: boolean;
  sms_notifications?: boolean;
  email_notifications?: boolean;
}

/**
 * Maps the 6 frontend notification toggles onto the 6 backend flags. The backend's flag set is a
 * best-guess placeholder (per the backend team) and doesn't line up 1:1 in meaning with the UI's
 * real toggle labels, so every mapping below is a deliberate, documented approximation:
 *
 * - `newLessons`      -> `lesson_reminders`   : direct match (new-lesson / lesson-reminder notices).
 * - `platformAds`     -> `promotions`         : direct match.
 * - `requestUpdates`  -> `new_subscriptions`  : closest available flag for "order/request" updates
 *                                                (subscription-request activity), no exact backend
 *                                                equivalent for a generic "request" concept.
 * - `newMessages`      -> `sms_notifications`  : closest available flag — no backend flag exists for
 *                                                in-app messages, so it's mapped to the closest
 *                                                "you got something" channel flag.
 * - `contactRequests`  -> `payment_updates`    : closest available flag — teacher/contact requests on
 *                                                this platform are tied to paid subscriptions, no
 *                                                dedicated "contact request" flag exists.
 * - `mentions`         -> `email_notifications`: closest available flag — mention-style alerts are
 *                                                commonly delivered by email elsewhere, no dedicated
 *                                                "mentions" flag exists.
 *
 * @param prefs
 *
 * @return NotificationSettingsPayload
 */
function toNotificationPayload(prefs: Partial<NotificationPrefs>): NotificationSettingsPayload {
  const payload: NotificationSettingsPayload = {};
  if (prefs.newLessons !== undefined) payload.lesson_reminders = prefs.newLessons;
  if (prefs.platformAds !== undefined) payload.promotions = prefs.platformAds;
  if (prefs.requestUpdates !== undefined) payload.new_subscriptions = prefs.requestUpdates;
  if (prefs.newMessages !== undefined) payload.sms_notifications = prefs.newMessages;
  if (prefs.contactRequests !== undefined) payload.payment_updates = prefs.contactRequests;
  if (prefs.mentions !== undefined) payload.email_notifications = prefs.mentions;

  return payload;
}

/**
 * Inverse of `toNotificationPayload` — hydrates the UI toggles from the saved backend state (`/auth/me`'s
 * `notification_preferences`). Flags the student never changed are absent, so they keep the given defaults.
 *
 * @param payload
 * @param defaults
 *
 * @return NotificationPrefs
 */
export function fromNotificationPayload(payload: NotificationSettingsPayload | null | undefined, defaults: NotificationPrefs): NotificationPrefs {
  return {
    newLessons: payload?.lesson_reminders ?? defaults.newLessons,
    platformAds: payload?.promotions ?? defaults.platformAds,
    requestUpdates: payload?.new_subscriptions ?? defaults.requestUpdates,
    newMessages: payload?.sms_notifications ?? defaults.newMessages,
    contactRequests: payload?.payment_updates ?? defaults.contactRequests,
    mentions: payload?.email_notifications ?? defaults.mentions,
  };
}

export interface UpdateProfileData {
  name?: string;
  region?: "west_bank" | "gaza";
  branch?: "scientific" | "literary" | "sharia" | null;
  gender?: "male" | "female" | null;
  birth_date?: string | null;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/** `POST /user/v1/profile/edit` — updates the signed-in user's account fields. */
export function updateProfile(data: UpdateProfileData): Promise<AuthUser> {
  return apiProxy.post<AuthUser>("/user/v1/profile/edit", data);
}

/** `POST /user/v1/profile/avatar` (multipart) — replaces the signed-in user's avatar. */
export function updateAvatar(avatar: File): Promise<AuthUser> {
  return apiProxy.postForm<AuthUser>("/user/v1/profile/avatar", { avatar });
}

/** `POST /user/v1/settings/password` — changes the signed-in user's password. */
export function changePassword(data: ChangePasswordData): Promise<Record<string, never>> {
  return apiProxy.post<Record<string, never>>("/user/v1/settings/password", data);
}

/** `POST /user/v1/settings/notifications` — see `toNotificationPayload` for the frontend -> backend field mapping. */
export function updateNotifications(prefs: Partial<NotificationPrefs>): Promise<Record<string, never>> {
  return apiProxy.post<Record<string, never>>("/user/v1/settings/notifications", toNotificationPayload(prefs));
}

/**
 * `DELETE /user/v1/account` — soft-deletes the signed-in user's account and revokes their tokens
 * server-side. Uses `apiProxy.raw` (rather than `apiProxy.delete`) because a DELETE request needs
 * a JSON body here (`{reasons}`), which the `delete()` helper's options type doesn't expose.
 *
 * @param reasons
 * @param otherReason free text typed under the "other" option (sent as `other_reason`)
 *
 * @return Promise<Record<string, never>>
 */
export function deleteAccount(reasons: number[], otherReason?: string): Promise<Record<string, never>> {
  return apiProxy
    .raw<Record<string, never>>({ method: "delete", url: "/user/v1/account", data: { reasons, other_reason: otherReason || undefined } })
    .then((envelope) => envelope.data as Record<string, never>);
}
