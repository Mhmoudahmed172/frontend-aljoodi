"use client";

import Image from "next/image";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Modal } from "@/components/ui/Modal";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon, UploadIcon } from "@/components/ui/Icons";
import { SuccessOverlay } from "@/features/auth/components/ResetPasswordForm";
import { useSubscription } from "../hooks/useSubscription";
import type { SubscriptionScope } from "../types/subscription.types";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  successHref?: string;
  /** `CoursePackage.uuid` being subscribed to. Submission is blocked (with an inline error) until this is provided. */
  courseUuid?: string;
  /** Which price/scope the student picked on the subject page. */
  scope?: SubscriptionScope;
}

export function SubscriptionModal({ open, onClose, successHref = "/dashboard", courseUuid, scope }: SubscriptionModalProps) {
  const { t } = useT();
  const [success, setSuccess] = useState(false);
  const form = useSubscription({ courseUuid, scope, onSuccess: () => setSuccess(true) });

  if (success) {
    return <SuccessOverlay title={t("subscription.successTitle")} text={t("subscription.successText")} cta={t("subscription.goHome")} href={successHref} />;
  }

  // Bank transfer details of the selected method: one block per active beneficiary (holder name, bank, IBAN,
  // account number, mobile...) followed by the min/max amount limits when set.
  const beneficiaryRows = (form.selectedMethod?.beneficiaries ?? []).map((b) =>
    [
      { label: t("subscription.accountHolder"), value: b.account_holder_name },
      { label: t("subscription.bankName"), value: b.bank_name },
      b.branch_name ? { label: t("subscription.branchName"), value: b.branch_name } : null,
      { label: t("subscription.iban"), value: b.iban },
      b.account_number ? { label: t("subscription.accountNumber"), value: b.account_number } : null,
      b.swift ? { label: t("subscription.swift"), value: b.swift } : null,
      b.mobile ? { label: t("subscription.mobile"), value: b.mobile } : null,
      { label: t("subscription.currency"), value: b.currency },
    ].filter((row): row is { label: string; value: string } => row !== null),
  );
  const limitRows = form.selectedMethod
    ? [
        form.selectedMethod.min_amount != null ? { label: t("subscription.minAmount"), value: String(form.selectedMethod.min_amount) } : null,
        form.selectedMethod.max_amount != null ? { label: t("subscription.maxAmount"), value: String(form.selectedMethod.max_amount) } : null,
      ].filter((row): row is { label: string; value: string } => row !== null)
    : [];
  const detailGroups = [...beneficiaryRows, ...(limitRows.length ? [limitRows] : [])];
  const notes = (form.selectedMethod?.beneficiaries ?? []).map((b) => b.notes).filter(Boolean);

  return (
    <Modal open={open} onClose={onClose} className="max-w-[680px] p-7">
      <div className="flex justify-center">
        <Logo width={104} href="" />
      </div>
      <h2 className="mt-3 flex items-center gap-2 text-2xl font-black text-text-heading">
        {t("subscription.title")}
        <span className="text-[11px] font-semibold text-primary">{t("subscription.packageHint")}</span>
      </h2>

      <form onSubmit={form.submit} className="mt-4 flex flex-col gap-4">
        <section className="rounded-2xl bg-surface p-4">
          <h3 className="text-sm font-bold text-text-heading">{t("subscription.step1")}</h3>
          {form.paymentMethodsLoading ? (
            <div className="mt-3 grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-white" />
              ))}
            </div>
          ) : form.paymentMethods.length === 0 ? (
            <p className="mt-3 rounded-xl bg-white px-4 py-6 text-center text-xs text-text-soft">{t("subscription.noPaymentMethods")}</p>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-4">
              {form.paymentMethods.map((m) => {
                const active = form.methodUuid === m.uuid;
                return (
                  <button
                    key={m.uuid}
                    type="button"
                    onClick={() => form.setMethodUuid(m.uuid)}
                    className={cn("flex flex-col items-center gap-2 rounded-xl border bg-white px-3 py-4", active ? "border-primary" : "border-transparent")}
                  >
                    {m.logo_url ? (
                      <Image src={m.logo_url} alt="" width={56} height={56} className="size-14 rounded-lg object-contain" />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-lg bg-primary-subtle text-lg font-black text-primary">{m.name.charAt(0)}</div>
                    )}
                    <span className="text-xs font-bold text-text-heading">{m.name}</span>
                    {m.description && <span className="text-[10px] text-text-soft">{m.description}</span>}
                  </button>
                );
              })}
            </div>
          )}
          {form.selectedMethod && detailGroups.length > 0 && (
            <div className="mt-4 rounded-xl bg-white">
              <button type="button" onClick={() => form.setBankOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-bold text-text-heading">
                {t("subscription.bankDetails")}
                {form.bankOpen ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
              </button>
              {form.bankOpen && (
                <div className="px-5 pb-3">
                  {detailGroups.map((rows, g) => (
                    <ul key={g} className={g > 0 ? "mt-3 border-t-2 border-primary-subtle" : undefined}>
                      {rows.map((row) => (
                        <li key={row.label} className="flex items-center justify-between gap-3 border-t border-border py-3 text-xs">
                          <span className="shrink-0 font-semibold text-primary">{row.label}</span>
                          <span className="flex min-w-0 items-center gap-2 font-bold text-text-heading" dir="auto">
                            <span className="truncate" dir="ltr">
                              {row.value}
                            </span>
                            <button type="button" onClick={() => form.copy(row.value)} className="flex shrink-0 items-center gap-1 rounded-md bg-primary-subtle px-2 py-1 text-[10px] text-primary">
                              <CopyIcon size={12} />
                              {t("common.copy")}
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ))}
                  {notes.map((note) => (
                    <p key={note} className="mt-3 rounded-lg bg-accent-subtle px-3 py-2 text-[11px] leading-5 text-text-muted">
                      {note}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-surface p-4">
          <h3 className="text-sm font-bold text-text-heading">{t("subscription.step2")}</h3>
          <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-primary bg-primary-subtle px-4 py-8 text-center">
            <UploadIcon size={28} className="text-primary" />
            <span className="text-xs font-bold text-text-heading">{form.file?.name ?? t("subscription.uploadTitle")}</span>
            <span className="text-[10px] text-primary">{t("subscription.uploadHint")}</span>
            <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => form.setFile(e.target.files?.[0] ?? null)} />
          </label>
        </section>

        <section className="rounded-2xl bg-surface p-4">
          <h3 className="text-sm font-bold text-text-heading">{t("subscription.step3")}</h3>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <Input id="sender" label={t("subscription.senderName")} placeholder={t("subscription.senderPlaceholder")} value={form.senderName} onChange={(e) => form.setSenderName(e.target.value)} className="h-10 bg-white text-xs" />
            <Input id="mobile" label={t("subscription.mobile")} placeholder={t("auth.phonePlaceholder")} value={form.mobile} onChange={(e) => form.setMobile(e.target.value)} className="h-10 bg-white text-xs" dir="ltr" />
          </div>
        </section>

        <Button type="submit" fullWidth size="lg" loading={form.loading}>
          {t("common.send")}
        </Button>
      </form>
    </Modal>
  );
}
