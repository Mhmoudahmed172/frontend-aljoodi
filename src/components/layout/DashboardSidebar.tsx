"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { BookIcon, CloseIcon, ExamIcon, HomeIcon, LayersIcon, LibraryIcon, SettingsIcon, TeacherIcon } from "@/components/ui/Icons";

const items = [
  { key: "dashboard.home", href: "/dashboard", icon: HomeIcon, exact: true },
  { key: "dashboard.mySubjects", href: "/dashboard/subjects", icon: BookIcon },
  { key: "dashboard.library", href: "/dashboard/library", icon: LibraryIcon },
  { key: "dashboard.myExams", href: "/dashboard/exams", icon: ExamIcon },
  { key: "dashboard.explore", href: "/dashboard/explore", icon: LayersIcon },
  { key: "dashboard.teachers", href: "/dashboard/teachers", icon: TeacherIcon },
  { key: "dashboard.settings", href: "/dashboard/settings", icon: SettingsIcon },
];

interface DashboardSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ open = false, onClose }: DashboardSidebarProps) {
  const { t } = useT();
  const pathname = usePathname();

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "me-6 flex h-14 items-center gap-3 rounded-e-2xl ps-8 text-sm font-semibold text-white/90 transition hover:bg-white/10",
              active && "bg-white/20 font-bold text-white",
            )}
          >
            <Icon size={20} />
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col bg-primary text-white lg:flex">
        <div className="flex justify-center py-10">
          <Logo white width={120} href="/dashboard" />
        </div>
        {nav}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-text-heading/40" onClick={onClose} />
          <aside className="absolute inset-y-0 start-0 flex w-[260px] flex-col bg-primary text-white shadow-card">
            <div className="flex items-center justify-between px-5 py-6">
              <Logo white width={100} href="/dashboard" />
              <button type="button" onClick={onClose} className="text-white/80" aria-label={t("common.close")}>
                <CloseIcon size={20} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
