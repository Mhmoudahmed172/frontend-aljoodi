"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { apiProxy, type ApiError } from "@/lib/api";
import { errorMessage, useApiMutation } from "@/lib/api/hooks";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { PriceRegion } from "@/features/region/useRegion";
import * as settingsService from "../services/settingsService";
import type { NotificationPrefs } from "../services/settingsService";

export type SettingsTab = "account" | "notifications" | "appearance" | "privacy";
export type Theme = "light" | "dark" | "auto";

/** No backend endpoint exists for theme (see task brief) — it stays local-only, persisted in localStorage. */
const THEME_STORAGE_KEY = "aljoodi:theme";

const DEFAULT_NOTIF: NotificationPrefs = {
  newLessons: true,
  platformAds: false,
  requestUpdates: false,
  newMessages: true,
  contactRequests: false,
  mentions: false,
};

/** Revokes the Passport token and clears the session cookie — same pattern as `ProfileMenu`'s logout. */
async function endSession(): Promise<void> {
  await apiProxy.post("/api/auth/logout").catch(() => undefined);
  await fetch("/api/session/logout", { method: "POST" }).catch(() => undefined);
}

export function useSettings(initialTab: SettingsTab = "account") {
  const { t, raw } = useT();
  const { data: user } = useCurrentUser();

  const [tab, setTab] = useState<SettingsTab>(initialTab);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  /** Backend `RegionEnum` value; `null` only until `/auth/me` hydrates it (or for an account with no region yet). */
  const [region, setRegion] = useState<PriceRegion | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [reasons, setReasons] = useState<number[]>([0]);
  const [otherReason, setOtherReason] = useState("");
  // "Other" is the last entry of `settings.reasons` (same index rule as `SettingsPage`).
  const otherReasonChecked = reasons.includes(raw<string[]>("settings.reasons").length - 1);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [notif, setNotif] = useState<NotificationPrefs>(DEFAULT_NOTIF);
  // Theme: no backend endpoint (see task brief) — local-only, read once from localStorage via a lazy initializer.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

      return stored === "light" || stored === "dark" || stored === "auto" ? stored : "light";
    } catch {
      return "light";
    }
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  // Hydrate the account form from the real signed-in user once `GET /auth/me` resolves. Adjusting
  // state during render (React's recommended pattern) instead of an effect, keyed by the user's uuid
  // so it re-syncs if the identity changes but doesn't fight the user's in-progress edits otherwise.
  const [syncedUserUuid, setSyncedUserUuid] = useState<string | undefined>(undefined);
  if (user && user.uuid !== syncedUserUuid) {
    setSyncedUserUuid(user.uuid);
    setFullName(user.name);
    setPhone(user.mobile ?? "");
    setRegion(user.region === "west_bank" || user.region === "gaza" ? user.region : null);
    setNotif(settingsService.fromNotificationPayload(user.notification_preferences, DEFAULT_NOTIF));
  }

  const setTheme = (value: Theme) => {
    setThemeState(value);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // best-effort only
    }
  };

  const updateProfileMutation = useApiMutation<settingsService.UpdateProfileData, AuthUser>(
    (data) => settingsService.updateProfile(data),
    { invalidate: [["auth", "me"]], successMessage: false },
  );

  const updateAvatarMutation = useApiMutation<File, AuthUser>(
    (avatar) => settingsService.updateAvatar(avatar),
    { invalidate: [["auth", "me"]], successMessage: false },
  );

  const changePasswordMutation = useApiMutation<settingsService.ChangePasswordData, Record<string, never>>(
    (data) => settingsService.changePassword(data),
    { successMessage: false },
  );

  const updateNotificationsMutation = useApiMutation<Partial<NotificationPrefs>, Record<string, never>>(
    (prefs) => settingsService.updateNotifications(prefs),
    { invalidate: [["auth", "me"]], successMessage: false, errorMessage: false },
  );

  const deleteAccountMutation = useApiMutation<{ reasons: number[]; otherReason?: string }, Record<string, never>>(
    ({ reasons: reasonCodes, otherReason: note }) => settingsService.deleteAccount(reasonCodes, note),
    { successMessage: false },
  );

  const loading = updateProfileMutation.isPending || changePasswordMutation.isPending || deleteAccountMutation.isPending;

  const saveAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // The name is locked (it is drawn on the lesson video watermark), so only the region is sent.
      // `region` comes from the two-option picker, so it is always a valid `RegionEnum` value (omitted only if unset).
      await updateProfileMutation.mutateAsync({ region: region ?? undefined });
      setSaved(true);
    } catch {
      // toasted by useApiMutation
    }
  };

  const confirmDelete = async () => {
    try {
      // The free-text note belongs to the "other" option only — sent just when that option is ticked.
      await deleteAccountMutation.mutateAsync({ reasons, otherReason: otherReasonChecked ? otherReason.trim() || undefined : undefined });
      setDeleteOpen(false);
      setDeleted(true);
      await endSession();
    } catch {
      // toasted by useApiMutation
    }
  };

  const uploadAvatar = (file: File) => {
    updateAvatarMutation.mutate(file, {
      onError: (error) => toast.error(errorMessage(error)),
    });
  };

  const toggleReason = (i: number) => setReasons((r) => (r.includes(i) ? r.filter((x) => x !== i) : [...r, i]));

  const toggleNotif = (key: keyof NotificationPrefs) => (value: boolean) => {
    const previous = notif[key];
    setNotif((n) => ({ ...n, [key]: value }));
    updateNotificationsMutation.mutate({ [key]: value } as Partial<NotificationPrefs>, {
      onError: (error) => {
        setNotif((n) => ({ ...n, [key]: previous }));
        toast.error(errorMessage(error));
      },
    });
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(undefined);
    if (!passwords.current || !passwords.next) {
      toast.error(t("auth.fillAllFields"));

      return;
    }
    if (passwords.confirm && passwords.next !== passwords.confirm) {
      toast.error(t("auth.passwordsMismatch"));

      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: passwords.current,
        password: passwords.next,
        password_confirmation: passwords.confirm || passwords.next,
      });
      toast.success(t("settings.passwordUpdated"));
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordOpen(false);
    } catch (e) {
      const apiError = e as ApiError;
      const fieldError = apiError.fieldError?.("current_password");
      if (fieldError) setPasswordError(fieldError);
    }
  };

  return {
    tab, setTab, fullName, setFullName, phone, setPhone, region, setRegion, saved, setSaved, deleteOpen, setDeleteOpen, deleted,
    reasons, toggleReason, otherReason, setOtherReason, notif, toggleNotif, theme, setTheme, passwords, setPasswords, passwordError, loading, saveAccount, confirmDelete, updatePassword,
    passwordOpen, setPasswordOpen, devicesOpen, setDevicesOpen,
    avatarUrl: user?.avatar_url, uploadAvatar, avatarUploading: updateAvatarMutation.isPending,
  };
}
