// app/dashboard/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to events page after a brief delay
    const timer = setTimeout(() => {
      router.push("/dashboard/events");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00509E]" />
        <p className="text-gray-600">Redirecting to events...</p>
      </div>
    </div>
  );
}
