import { LOCAL_PREVIEW } from '@/lib/preview/catalog'
export function PreviewNotice() {
  if (!LOCAL_PREVIEW) return null
  return (
    <aside className="brand-preview-note" role="note">
      <strong>نسخة تجريبية — محتوى توضيحي</strong>
    </aside>
  )
}
