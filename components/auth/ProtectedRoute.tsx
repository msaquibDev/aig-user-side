"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // ✅ Run only on client side
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // 🚨 No token: redirect to login with callbackUrl
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    // ⏳ Loading screen while checking auth
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
