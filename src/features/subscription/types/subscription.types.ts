/** `SubscriptionScopeEnum` value — which half(s) of the course the student is subscribing to. */
export type SubscriptionScope = "first" | "second" | "both";

/** `PaymentBeneficiaryResource` — a platform bank account the student transfers to (manual methods only). */
export interface PaymentBeneficiary {
  uuid: string;
  account_holder_name: string;
  bank_name: string;
  branch_name: string | null;
  iban: string;
  account_number: string | null;
  swift: string | null;
  mobile: string | null;
  currency: string;
  notes: string | null;
}

/** `PaymentMethodResource` — `GET /api/v1/payment-methods` item. The gateway `config` is never exposed; the active
 *  bank beneficiaries (IBAN, holder name, bank, mobile) are, since a manual transfer needs them. */
export interface PaymentMethodItem {
  uuid: string;
  name: string;
  driver: string;
  type: string;
  description: string | null;
  logo_url: string | null;
  min_amount: string | number | null;
  max_amount: string | number | null;
  beneficiaries?: PaymentBeneficiary[];
}

/** Minimal course/subject summary embedded in a `SubscriptionResource`. */
export interface SubscriptionRelationSummary {
  uuid: string;
  name: string;

  [key: string]: unknown;
}

/** Payment info embedded in a `SubscriptionResource`. */
export interface SubscriptionPayment {
  code: string;
  status: string;
  amount: string | number;
}

/** `SubscriptionResource` — returned by both `POST` and `GET /user/v1/subscriptions`. */
export interface Subscription {
  uuid: string;
  scope: SubscriptionScope;
  status: string;
  price: string | number;
  currency: string;
  starts_at: string | null;
  expires_at: string | null;
  course: SubscriptionRelationSummary;
  subject: SubscriptionRelationSummary;
  payment: SubscriptionPayment;
}

/** `POST /user/v1/subscriptions` request body (multipart/form-data). */
export interface SubscribePayload {
  course_uuid: string;
  scope: SubscriptionScope;
  payment_method_uuid: string;
  sender_name: string;
  mobile: string;
  receipt: File;
}
