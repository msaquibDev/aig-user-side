// /app/registration/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";

export default function SuccessRedirectPage() {
  const { basicDetails } = useRegistrationStore();
  const router = useRouter();

  useEffect(() => {
    if (!basicDetails.fullName) {
      // Redirect if accessed directly
      router.push("/registration/my-registration");
      return;
    }

    // Redirect to actual QR page after delay
    const timeout = setTimeout(() => {
      router.push("/registration/success/badge");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [basicDetails.fullName, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
      <p className="text-gray-700 text-lg">Generating your badge...</p>
    </div>
  );
}
