import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

/** Global 404 page (Tailwind). Not part of new_front's mocked design — the design system had no not-found screen. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-6 text-center">
      <Logo />
      <p className="text-7xl font-extrabold text-primary">404</p>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-text-heading">الصفحة غير موجودة</h1>
        <p className="text-sm text-text-muted">عذرًا، الصفحة التي تبحث عنها غير متوفرة.</p>
      </div>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
      >
        العودة للرئيسية
      </Link>
    </main>
  );
}
