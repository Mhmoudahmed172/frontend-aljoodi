import { api } from "@/lib/api/client";

export interface ContactPayload {
  name: string;
  mobile: string;
  message: string;
}

/** `POST /api/v1/contact {name, mobile, message}` — public contact form submission. */
export function submit(payload: ContactPayload): Promise<Record<string, never>> {
  return api.post<Record<string, never>>("/api/v1/contact", payload);
}
