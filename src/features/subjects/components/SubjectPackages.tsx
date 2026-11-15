"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { CheckCircleSolidIcon } from "@/components/ui/Icons";
import { SubscriptionModal } from "@/features/subscription/components/SubscriptionModal";
import { useSessionStatus } from "@/features/auth/hooks/useSessionStatus";
import { withRedirect } from "@/features/auth/utils/redirect";
import { useRegion, type PriceRegion } from "@/features/region/useRegion";
import { cn } from "@/lib/utils";
import { useSubject } from "../hooks/useSubject";
import { pickCourse, subjectCourseHref } from "../utils/teachers";

const SCOPE_LABEL_KEYS = { first: "subjects.package1", second: "subjects.package2", both: "subjects.packageBoth" } as const;
const SCOPE_DESC_KEYS = { first: "subjects.packageDesc1", second: "subjects.packageDesc2", both: "subjects.packageDescBoth" } as const;

/**
 * Video preview + blue packages card at the top of the public subject page (Figma UI-44): each package shows the title,
 * a 14px #5B5B5B sub-description with a blue check icon, the 20px bold #612FCF price and the subscribe button.
 * Loaded from `GET /api/v1/subjects/{slug}`. Guests are sent to `/login` (returning here afterwards) before the
 * subscription form opens, since `POST /user/v1/subscriptions` needs a signed-in student.
 */
export function SubjectPackages({ slug, courseSlug }: { slug: string; courseSlug?: string | null }) {
  const { t } = useT();
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSessionStatus();
  const [open, setOpen] = useState(false);
  const [selectedScope, setSelectedScope] = useState<keyof typeof SCOPE_LABEL_KEYS | null>(null);
  const { subject, loading } = useSubject(slug);
  const { region, setRegion, locked } = useRegion();
  const course = subject ? pickCourse(subject, courseSlug) : undefined;
  const regions: PriceRegion[] = ["west_bank", "gaza"];
  const scopes = course ? (Object.entries(course.prices) as [keyof typeof SCOPE_LABEL_KEYS, string | null][]).filter(([, price]) => price !== null) : [];

  if (loading || !course || !subject) {
    return null;
  }

  const startSubscription = (scope: keyof typeof SCOPE_LABEL_KEYS) => {
    if (sessionLoading) return;
    if (session?.authenticated !== true) {
      toast.info(t("subjects.loginToSubscribe"));
      router.push(withRedirect("/login", `${subjectCourseHref(slug, course.slug)}#subscribe`));

      return;
    }
    setSelectedScope(scope);
    setOpen(true);
  };

  return (
    <div id="subscribe" className="grid scroll-mt-24 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="relative min-h-56 overflow-hidden rounded-2xl md:min-h-72">
        <Image src={course.cover_url ?? "/images/classroom-1.jpg"} alt={course.name} fill className="object-cover" sizes="800px" />
      </div>
      <div className="rounded-2xl bg-primary p-4 text-white">
        <h3 className="text-sm font-bold">{t("subjects.packagesTitle")}</h3>
        {/* Prices depend on the region: locked to the account's region when signed in, a visitor picks one. */}
        <div className="mb-3 mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/85">
          <span>{t("subjects.pricesForRegion")}</span>
          {locked ? (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-semibold text-white">{t(`subjects.priceRegion.${region}`)}</span>
          ) : (
            <span className="inline-flex overflow-hidden rounded-full bg-white/15 p-0.5">
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={cn("rounded-full px-2.5 py-0.5 font-semibold transition", region === r ? "bg-white text-primary" : "text-white/85 hover:text-white")}
                >
                  {t(`subjects.priceRegion.${r}`)}
                </button>
              ))}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {scopes.map(([scope, price]) => (
            <div key={scope} className="rounded-xl bg-white p-4 text-text-heading">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold">{t(SCOPE_LABEL_KEYS[scope])}</span>
                <span className="text-[20px] font-bold text-violet" dir="ltr">
                  {price} {t("common.currency")}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm leading-[1.5] text-text-muted">
                <CheckCircleSolidIcon size={16} className="shrink-0 text-primary" />
                {t(SCOPE_DESC_KEYS[scope], { subject: subject.name })}
              </p>
              <Button
                fullWidth
                className="mt-3 h-9 text-xs"
                onClick={() => startSubscription(scope)}
              >
                {t("common.subscribePackage")}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <SubscriptionModal open={open} onClose={() => setOpen(false)} courseUuid={course.uuid} scope={selectedScope ?? undefined} />
    </div>
  );
}
