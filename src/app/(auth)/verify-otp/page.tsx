import { Suspense } from "react";
import { AuthCardLayout } from "@/features/auth/components/AuthCardLayout";
import { OtpForm } from "@/features/auth/components/OtpForm";

export default function VerifyOtpPage() {
  return (
    <AuthCardLayout showMascot={false}>
      {/* OtpForm reads `mobile`/`purpose` via useSearchParams(), which requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <OtpForm />
      </Suspense>
    </AuthCardLayout>
  );
}
