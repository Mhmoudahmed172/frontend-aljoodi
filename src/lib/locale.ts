export type Locale = "ar" | "en";
export const defaultLocale: Locale = "ar";

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
