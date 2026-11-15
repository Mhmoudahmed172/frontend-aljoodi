/** Strips HTML tags and decodes common entities so rich-text API fields can be shown as plain text. */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Removes scripts, iframes, inline event handlers and javascript: URLs from API rich text before rendering it. */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'>\s]*\2/gi, "");
}
