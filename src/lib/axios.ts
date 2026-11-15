import axios from "axios";

/** Standardized API response wrapper used across services. */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  /** Backend error code (e.g. `USER_NOT_REGISTERED`) when the failure came from the API. */
  code?: string;
  success: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Wrap a promise into the standard { data, error, success } shape. */
export async function toApiResponse<T>(promise: Promise<T>): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const code = err && typeof err === "object" && "code" in err && typeof (err as { code?: unknown }).code === "string" ? (err as { code: string }).code : undefined;
    return { data: null, error: message, code, success: false };
  }
}
