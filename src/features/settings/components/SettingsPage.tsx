"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { BellIcon, BookOpenIcon, CheckIcon, ClockIcon, EditIcon, GlobeIcon, LockIcon, MailIcon, MapPinIcon, PaperPlaneIcon, PhoneIcon, UserIcon, UsersIcon, VideoIcon } from "@/components/ui/Icons";
import { SuccessOverlay } from "@/features/auth/components/ResetPasswordForm";
import type { PriceRegion } from "@/features/region/useRegion";
import { useSettings, type SettingsTab, type Theme } from "../hooks/useSettings";

/** Dashboard settings: side menu + account / notifications / privacy & security panels (the theme/appearance tab is hidden). */
export function SettingsPage({ initialTab = "account" }: { initialTab?: SettingsTab }) {
  const { t, raw } = useT();
  const s = useSettings(initialTab);
  const tabs: { key: SettingsTab; icon: ReactNode }[] = [
    { key: "account", icon: <UserIcon size={16} /> },
    { key: "notifications", icon: <BellIcon size={16} /> },
    { key: "privacy", icon: <LockIcon size={16} /> },
  ];
  const reasons = raw<string[]>("settings.reasons");
  const otherReasonIndex = reasons.length - 1;
  const otherChecked = s.reasons.includes(otherReasonIndex);
  const regions: PriceRegion[] = ["west_bank", "gaza"];

  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
      <aside className="md:border-e md:border-border md:pe-8">
        <h1 className="text-xl font-black text-text-heading">{t("settings.title")}</h1>
        <ul className="mt-4 flex flex-row gap-1 overflow-x-auto md:flex-col">
          {tabs.map((tab) => {
            const active = s.tab === tab.key;
            return (
              <li key={tab.key}>
                <button
                  type="button"
                  onClick={() => s.setTab(tab.key)}
                  className={cn(
                    "flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-text transition md:border-e-2",
                    active ? "border-primary bg-primary-subtle font-bold text-text-heading" : "border-transparent hover:bg-surface",
                  )}
                >
                  <span className={cn("flex size-8 items-center justify-center rounded-lg", active ? "bg-primary text-white" : "border border-border text-text")}>{tab.icon}</span>
                  {t(`settings.${tab.key}`)}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="max-w-[560px]">
        {s.tab === "account" && (
          <form onSubmit={s.saveAccount} className="flex flex-col gap-5">
            <h2 className="text-lg font-black text-text-heading">{t("settings.account")}</h2>
            <div className="flex items-center gap-3">
              <span className="relative">
                <Avatar src={s.avatarUrl ?? "/images/avatar-shahd.png"} alt="" size={48} />
                <label className="absolute -bottom-0.5 -end-0.5 flex size-5 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                  <EditIcon size={10} />
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={s.avatarUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) s.uploadAvatar(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </span>
              <span className="text-base font-bold text-text-heading">{s.fullName}</span>
            </div>
            {/* Name and mobile number aren't editable via `POST /user/v1/profile/edit` (the name is on the video watermark) — shown read-only. */}
            <Input id="fullName" label={t("settings.fullName")} value={s.fullName} disabled className="h-11 rounded-xl opacity-70" />
            <Input id="phone" label={t("settings.phone")} value={s.phone} disabled className="h-11 rounded-xl opacity-70" dir="ltr" />
            {/* Two-option picker (same look as the register form) so `region` is always a valid `RegionEnum` value. */}
            <div role="radiogroup" aria-labelledby="region-label" className="flex flex-col gap-2">
              <span id="region-label" className="text-sm font-bold text-text-heading">
                {t("settings.region")}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {regions.map((r) => {
                  const active = s.region === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => s.setRegion(r)}
                      className={cn("flex h-11 items-center justify-between rounded-xl border bg-white px-4 text-xs", active ? "border-primary text-text" : "border-border text-text-muted")}
                    >
                      <span className="flex items-center gap-1.5">
                        <MapPinIcon size={14} className="text-text-muted" />
                        {t(`common.region.${r}`)}
                      </span>
                      <span className={cn("flex size-4 items-center justify-center rounded-full border", active ? "border-primary" : "border-border-strong")}>
                        {active && <span className="size-2.5 rounded-full bg-primary" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-start">
              <Button type="submit" className="h-10 rounded-lg px-8 text-xs" loading={s.loading}>
                {t("settings.save")}
              </Button>
            </div>
            <button type="button" onClick={() => s.setDeleteOpen(true)} className="mt-4 flex items-center gap-2 self-start text-xs font-semibold text-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
              </svg>
              {t("settings.deleteAccount")}
            </button>
          </form>
        )}

        {s.tab === "notifications" && (
          <div className="flex flex-col gap-6">
            <ToggleGroup
              title={t("settings.platformNotifications")}
              rows={[
                { icon: <BookOpenIcon size={16} />, label: t("settings.newLessons"), checked: s.notif.newLessons, onChange: s.toggleNotif("newLessons") },
                { icon: <PaperPlaneIcon size={16} />, label: t("settings.platformAds"), checked: s.notif.platformAds, onChange: s.toggleNotif("platformAds") },
                { icon: <GlobeIcon size={16} />, label: t("settings.requestUpdates"), checked: s.notif.requestUpdates, onChange: s.toggleNotif("requestUpdates") },
              ]}
            />
            <ToggleGroup
              title={t("settings.messageNotifications")}
              rows={[
                { icon: <MailIcon size={16} />, label: t("settings.newMessages"), checked: s.notif.newMessages, onChange: s.toggleNotif("newMessages") },
                { icon: <UsersIcon size={16} />, label: t("settings.contactRequests"), checked: s.notif.contactRequests, onChange: s.toggleNotif("contactRequests") },
                { icon: <VideoIcon size={16} />, label: t("settings.mentions"), checked: s.notif.mentions, onChange: s.toggleNotif("mentions") },
              ]}
            />
          </div>
        )}

        {s.tab === "appearance" && (
          <ToggleGroup
            title={t("settings.appearance")}
            rows={(["light", "dark", "auto"] as Theme[]).map((theme) => ({
              icon: theme === "light" ? <SunIcon /> : theme === "dark" ? <MoonIcon /> : <MonitorIcon />,
              label: t(`settings.${theme}`),
              checked: s.theme === theme,
              onChange: () => s.setTheme(theme),
            }))}
          />
        )}

        {/* Privacy & security (Figma UI-52): "account security" header + divider, then the change-password and logged-in devices rows. */}
        {s.tab === "privacy" && (
          <div className="flex flex-col">
            <h2 className="border-b border-border pb-4 text-lg font-black text-text-heading">{t("settings.accountSecurity")}</h2>
            <SecurityRow
              icon={<LockIcon size={20} />}
              title={t("settings.changePasswordTitle")}
              text={t("settings.changePasswordText")}
              action={t("settings.change")}
              onAction={() => s.setPasswordOpen(true)}
            />
            <SecurityRow
              icon={<MonitorIcon size={20} />}
              title={t("settings.devicesTitle")}
              badge={t("settings.activeDevice")}
              text={t("settings.devicesText")}
              action={t("settings.viewDevices")}
              onAction={() => s.setDevicesOpen(true)}
            />
          </div>
        )}
      </section>

      {s.saved && <SuccessOverlay title={t("settings.savedTitle")} text={t("settings.savedText")} cta={t("settings.goProfile")} href="/dashboard/profile" />}

      {/* Change password dialog (Figma UI-53): centered title, close on the top-left, two outlined fields, full-width primary CTA. */}
      <Modal open={s.passwordOpen} onClose={() => s.setPasswordOpen(false)} className="max-w-[480px]">
        <form onSubmit={s.updatePassword} className="flex flex-col gap-5 pt-2">
          <h2 className="text-center text-lg font-black text-text-heading">{t("settings.changePasswordTitle")}</h2>
          <PasswordInput
            id="current"
            label={t("settings.currentPassword")}
            placeholder="************"
            value={s.passwords.current}
            onChange={(e) => s.setPasswords({ ...s.passwords, current: e.target.value })}
            error={s.passwordError}
            className="h-11 rounded-lg"
          />
          <PasswordInput
            id="next"
            label={t("settings.newPassword")}
            placeholder="************"
            value={s.passwords.next}
            onChange={(e) => s.setPasswords({ ...s.passwords, next: e.target.value })}
            className="h-11 rounded-lg"
          />
          <Button type="submit" fullWidth className="h-11 rounded-lg text-sm" loading={s.loading}>
            {t("settings.changePasswordButton")}
          </Button>
        </form>
      </Modal>

      {/* Logged-in devices dialog (Figma UI-54). There is no sessions endpoint yet, so the list holds the current device only. */}
      <Modal open={s.devicesOpen} onClose={() => s.setDevicesOpen(false)} className="max-w-[480px]">
        <div className="flex flex-col gap-5 pt-2">
          <h2 className="text-center text-lg font-black text-text-heading">{t("settings.devicesTitle")}</h2>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center justify-between gap-3 rounded-lg bg-surface-input p-4">
              <span className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky text-primary">
                  <CurrentDeviceIcon />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-text-heading">
                    <CurrentDeviceName fallback={t("settings.unknownDevice")} />
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-text-muted">
                    <ClockIcon size={12} />
                    {t("common.now")} · {t("common.currentDevice")}
                  </span>
                </span>
              </span>
            </li>
          </ul>
          <Button variant="outline" fullWidth className="h-11 rounded-lg text-sm" onClick={() => s.setDevicesOpen(false)}>
            {t("common.cancel")}
          </Button>
        </div>
      </Modal>

      {/* Delete account dialog (Figma UI-51): mascot over the top-LEFT corner, green checkboxes, "other" reveals a textarea. */}
      <Modal open={s.deleteOpen} onClose={() => s.setDeleteOpen(false)} className="max-w-[520px] pt-10">
        <Image src="/images/mascot-sad.png" alt="" width={110} height={100} className="absolute -top-16 end-8 w-24" />
        <h2 className="text-lg font-black text-text-heading">{t("settings.deleteTitle")}</h2>
        <p className="mt-1 text-xs leading-5 text-text-muted">{t("settings.deleteText")}</p>
        <ul className="mt-4 flex flex-col gap-3">
          {reasons.map((reason, i) => (
            <li key={reason}>
              <Checkbox id={`reason-${i}`} tone="success" label={<span className="text-xs">{reason}</span>} checked={s.reasons.includes(i)} onChange={() => s.toggleReason(i)} />
            </li>
          ))}
        </ul>
        {otherChecked && (
          <textarea
            value={s.otherReason}
            onChange={(e) => s.setOtherReason(e.target.value)}
            placeholder={t("settings.otherReasonPlaceholder")}
            rows={3}
            className="mt-3 w-full rounded-lg border border-border bg-surface-input px-4 py-3 text-xs text-text outline-none placeholder:text-text-soft focus:border-primary"
          />
        )}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="danger" className="h-10 rounded-lg text-xs" onClick={s.confirmDelete} loading={s.loading}>
            {t("settings.confirmDelete")}
          </Button>
          <Button variant="outline" className="h-10 rounded-lg bg-surface text-xs" onClick={() => s.setDeleteOpen(false)}>
            {t("settings.cancel")}
          </Button>
        </div>
      </Modal>

      {s.deleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-[480px] rounded-2xl bg-white px-8 py-10 text-center shadow-card">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success text-white">
              <CheckIcon size={32} strokeWidth={3} />
            </span>
            <h2 className="mt-5 text-xl font-black text-text-heading">{t("settings.deletedTitle")}</h2>
            <p className="mt-1 text-xs text-text-muted">{t("settings.deletedText")}</p>
            <Link href="/" className="mt-6 block">
              <Button fullWidth className="h-10 rounded-lg text-xs">{t("settings.backHome")}</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

interface SecurityRowProps {
  icon: ReactNode;
  title: string;
  badge?: string;
  text: string;
  action: string;
  onAction: () => void;
}

/** One "account security" row: #ECF6FE icon container + bold title (+ badge pill) + subtext on the right, blue action link on the left. */
function SecurityRow({ icon, title, badge, text, action, onAction }: SecurityRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky text-primary">{icon}</span>
        <div className="flex flex-col gap-1">
          <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-text-heading">
            {title}
            {badge && <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-[11px] font-semibold text-primary">{badge}</span>}
          </span>
          <span className="text-xs leading-5 text-text-muted">{text}</span>
        </div>
      </div>
      <button type="button" onClick={onAction} className="shrink-0 pt-3 text-xs font-bold text-primary hover:underline">
        {action}
      </button>
    </div>
  );
}

interface ToggleRow {
  icon: ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleGroup({ title, rows }: { title: string; rows: ToggleRow[] }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-black text-text-heading">{title}</h2>
      <ul className="flex flex-col gap-1">
        {rows.map((row) => (
          <li key={row.label} className={cn("flex items-center justify-between rounded-xl px-4 py-3", row.checked && "bg-surface")}>
            <span className="flex items-center gap-3 text-sm text-text">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-subtle text-primary">{row.icon}</span>
              {row.label}
            </span>
            <Toggle checked={row.checked} onChange={row.onChange} label={row.label} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Coarse device label derived from the browser's user agent (no sessions endpoint exists yet). */
function describeDevice(ua: string): string | null {
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Macintosh|Mac OS/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux PC";

  return null;
}

function CurrentDeviceName({ fallback }: { fallback: string }) {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;

  return <>{describeDevice(ua) ?? fallback}</>;
}

function CurrentDeviceIcon() {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const mobile = /iPhone|iPad|Android/i.test(ua);

  return mobile ? <PhoneIcon size={18} /> : <MonitorIcon size={18} />;
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
const MonitorIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);
