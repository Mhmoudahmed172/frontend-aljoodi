import { api, apiProxy } from "@/lib/api";
import type { PaymentMethodItem, SubscribePayload, Subscription } from "../types/subscription.types";

/** `GET /api/v1/payment-methods` — PUBLIC catalog endpoint, no auth required. */
export function getPaymentMethods(): Promise<{ items: PaymentMethodItem[] }> {
  return api.get<{ items: PaymentMethodItem[] }>("/api/v1/payment-methods");
}

/**
 * `POST /user/v1/subscriptions` (multipart/form-data, includes the `receipt` file).
 * May throw a 422 `ApiError` with `code: 'SCOPE_OVERLAP'` (an active/pending subscription already
 * exists for this course+scope) or `code: 'PAYMENT_METHOD_DISABLED'` (inactive/non-subscription method).
 *
 * @param payload
 *
 * @return Promise<Subscription>
 */
export function subscribe(payload: SubscribePayload): Promise<Subscription> {
  return apiProxy.postForm<Subscription>("/user/v1/subscriptions", payload as unknown as Record<string, unknown>);
}

/** `GET /user/v1/subscriptions` — the signed-in student's own subscriptions. */
export function getMySubscriptions(): Promise<{ items: Subscription[] }> {
  return apiProxy.get<{ items: Subscription[] }>("/user/v1/subscriptions");
}
