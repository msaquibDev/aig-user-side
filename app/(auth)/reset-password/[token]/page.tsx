import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading reset password page...</div>
        </div>
      }
    >
      <ResetPasswordContent params={resolvedParams} />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
