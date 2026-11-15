"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { useApiMutation, useApiQuery } from "@/lib/api/hooks";
import { isApiError } from "@/lib/api/errors";
import { subscribe } from "../services/subscriptionService";
import type { PaymentMethodItem, Subscription, SubscriptionScope } from "../types/subscription.types";

export type { PaymentMethodItem } from "../types/subscription.types";

interface UseSubscriptionParams {
  /** The course being subscribed to (`CoursePackage.uuid`). Submission is blocked until this is known. */
  courseUuid?: string;
  /** Which half(s) of the course — matches the price the student picked on the subject page. */
  scope?: SubscriptionScope;
  onSuccess?: (subscription: Subscription) => void;
}

/** `GET /api/v1/payment-methods` + `POST /user/v1/subscriptions` — drives the subscription confirmation modal. */
export function useSubscription({ courseUuid, scope, onSuccess }: UseSubscriptionParams) {
  const { t } = useT();
  const [methodUuid, setMethodUuid] = useState<string | undefined>(undefined);
  // Bank details start expanded: a manual transfer can't be made without them.
  const [bankOpen, setBankOpen] = useState(true);
  const [senderName, setSenderName] = useState("");
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data: methodsData, isLoading: methodsLoading } = useApiQuery<{ items: PaymentMethodItem[] }>(
    ["subscription", "payment-methods"],
    "/api/v1/payment-methods",
    undefined,
    { staleTime: 5 * 60 * 1000 },
  );
  const paymentMethods = methodsData?.items ?? [];

  // Default to the first available method once the list loads, without an effect: derived at render time.
  const effectiveMethodUuid = methodUuid ?? paymentMethods[0]?.uuid;
  const selectedMethod = paymentMethods.find((m) => m.uuid === effectiveMethodUuid);

  const mutation = useApiMutation(subscribe, {
    successMessage: false,
    errorMessage: false,
    onSuccess: (subscription) => {
      toast.success(t("subscription.submitted"));
      onSuccess?.(subscription);
    },
    onError: (error) => {
      if (error.code === "SCOPE_OVERLAP") {
        toast.error(t("subscription.scopeOverlap"));

        return;
      }
      if (error.code === "PAYMENT_METHOD_DISABLED") {
        toast.error(t("subscription.paymentMethodDisabled"));

        return;
      }
      toast.error(error.message || t("subscription.submitFailed"));
    },
  });

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("common.copied"));
    } catch {
      /* clipboard may be unavailable */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !mobile || !file) return toast.error(t("auth.fillAllFields"));
    if (!effectiveMethodUuid) return toast.error(t("subscription.selectMethod"));
    if (!courseUuid || !scope) return toast.error(t("subscription.missingPackage"));

    try {
      await mutation.mutateAsync({
        course_uuid: courseUuid,
        scope,
        payment_method_uuid: effectiveMethodUuid,
        sender_name: senderName,
        mobile,
        receipt: file,
      });
    } catch (error) {
      if (!isApiError(error)) throw error;
    }
  };

  return {
    paymentMethods,
    paymentMethodsLoading: methodsLoading,
    methodUuid: effectiveMethodUuid,
    setMethodUuid,
    selectedMethod,
    bankOpen,
    setBankOpen,
    senderName,
    setSenderName,
    mobile,
    setMobile,
    file,
    setFile,
    loading: mutation.isPending,
    submit,
    copy,
  };
}
