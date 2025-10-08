// components/auth/ProtectedRoute.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the access token in localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // If no token, redirect to login
      router.push("/login");
    } else {
      // Optional: Verify token validity with your backend
      verifyToken(token).then((isValid) => {
        if (!isValid) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          router.push("/login");
        } else {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      });
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00509E]" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}

// Optional: Function to verify token with backend
async function verifyToken(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.ok;
  } catch (error) {
    return false;
  }
}
