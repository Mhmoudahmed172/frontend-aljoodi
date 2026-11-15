"use client";

import { Suspense } from "react";
import { useT } from "@/lib/i18n";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  const { t } = useT();
  return (
    <AuthSplitLayout
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerHeroSubtitle")}
      mascot="/images/auth-register.webp"
      heading={
        <>
          {t("auth.registerHeroTitle")} <span className="marker-yellow">{t("auth.registerHeroHighlight")}</span>
        </>
      }
    >
      {/* RegisterForm reads `mobile` via useSearchParams(), which requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
