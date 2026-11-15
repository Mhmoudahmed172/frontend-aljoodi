"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { apiProxy } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CheckIcon } from "@/components/ui/Icons";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Logout flow (Figma UI-55 / UI-56): a confirmation dialog first (red confirm on the right, grey cancel on the left),
 * then — after the session is revoked — a success dialog with a green check and a "log in" CTA. The route only changes
 * when the user presses that CTA; nothing navigates on its own.
 */
export function LogoutDialog({ open, onClose }: LogoutDialogProps) {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const confirm = async () => {
    setLoading(true);
    // Best-effort token revoke, then always clear the local session cookie.
    await apiProxy.post("/api/auth/logout").catch(() => undefined);
    await fetch("/api/session/logout", { method: "POST" }).catch(() => undefined);
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 px-6 backdrop-blur-sm">
        <div className="relative w-full max-w-[480px] rounded-2xl bg-white px-8 pb-8 pt-10 text-center shadow-card">
          <Image src="/images/confetti.png" alt="" width={375} height={236} className="pointer-events-none absolute inset-x-0 top-2 mx-auto w-full opacity-80" />
          <span className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-success-strong text-white">
            <CheckIcon size={32} strokeWidth={3} />
          </span>
          <h2 className="relative mt-5 text-xl font-black text-text-heading">{t("common.logoutSuccessTitle")}</h2>
          <p className="relative mt-1 text-xs text-text-muted">{t("common.logoutSuccessText")}</p>
          <Link href="/login" className="relative mt-6 block">
            <Button fullWidth className="h-11 text-sm">{t("common.login")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-[480px] pt-12 text-center">
      <h2 className="text-lg font-black leading-[1.6] text-text-heading">{t("common.logoutConfirmTitle")}</h2>
      <p className="mt-2 text-xs leading-5 text-text-muted">{t("common.logoutConfirmText")}</p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button variant="danger" className="h-10 rounded-lg text-xs" onClick={confirm} loading={loading}>
          {t("common.logout")}
        </Button>
        <Button variant="outline" className="h-10 rounded-lg bg-surface text-xs" onClick={onClose}>
          {t("common.cancel")}
        </Button>
      </div>
    </Modal>
  );
}
