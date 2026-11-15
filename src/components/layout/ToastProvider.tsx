"use client";

import { Toaster } from "sonner";

/** Global toast container (bottom-center, RTL friendly). */
export function ToastProvider() {
  return <Toaster position="bottom-center" richColors dir="rtl" />;
}
