"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

import { defaultLocale, type Locale } from "./locale";

export { defaultLocale, getDirection, type Locale } from "./locale";

const dictionaries: Record<Locale, Record<string, unknown>> = { ar, en };

interface LocaleContextValue {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Read a non-string dictionary value (arrays / objects). */
  raw: <T>(key: string) => T;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  t: (key) => key,
  raw: <T,>() => [] as unknown as T,
});

function resolveRaw(dict: Record<string, unknown>, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, dict);
}

function resolve(dict: Record<string, unknown>, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, dict);
  return typeof value === "string" ? value : undefined;
}

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = resolve(dictionaries[locale], key) ?? resolve(dictionaries.en, key) ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v));
      }
      return text;
    },
    [locale],
  );
  const raw = useCallback(
    <T,>(key: string) => (resolveRaw(dictionaries[locale], key) ?? resolveRaw(dictionaries.en, key)) as T,
    [locale],
  );
  return <LocaleContext.Provider value={{ locale, t, raw }}>{children}</LocaleContext.Provider>;
}

/** Access the active locale and translation function. */
export function useT() {
  return useContext(LocaleContext);
}
