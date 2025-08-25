"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/app/store/useUserStore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function DashboardHeader({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  const router = useRouter();
  const { photo, fullName } = useUserStore(); // Zustand store
  const setUser = useUserStore((state) => state.setUser);

  const [loggingOut, setLoggingOut] = useState(false);

  // Replace with dynamic values if needed
  const eventTitle = "AIG IBD Summit 2025";
  const eventDateTime = "Sat Aug 2, 2025 | 08:00 PM (IST)";

  // ✅ Fetch latest user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        if (!data) throw new Error("No user data found");

        // Use the latest profile picture and full name
        setUser({
          photo: data.profilePicture || "/authImg/user.png",
          fullName: data.fullName || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
  }, [setUser]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-r from-[#000d4e] to-[#005aa7] shadow sticky top-0 z-50">
      {/* Left: Logo + Event Info + Hamburger */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onMenuToggle}
          className="lg:hidden text-white focus:outline-none cursor-pointer"
        >
          <Menu size={24} />
        </Button>

        <Link href="/">
          <Image
            src="/headerImg/logo.png"
            alt="AIG Hospitals Logo"
            width={120}
            height={40}
            className="object-contain cursor-pointer"
          />
        </Link>

        <div className="hidden md:flex flex-col justify-center text-white ml-6">
          <h1 className="text-lg font-semibold leading-tight">{eventTitle}</h1>
          <p className="text-sm text-gray-200">{eventDateTime}</p>
        </div>
      </div>

      {/* Right: Avatar + Logout */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile" className="cursor-pointer">
          <Avatar className="border-2 border-purple-600 w-10 h-10 cursor-pointer">
            <AvatarImage src={photo || "/authImg/user.png"} />
            <AvatarFallback>{fullName?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </Link>
        <Button
          onClick={handleLogout}
          variant="outline"
          disabled={loggingOut}
          className="border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] px-4 py-2 cursor-pointer"
        >
          {loggingOut ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait
            </div>
          ) : (
            "Logout"
          )}
        </Button>
      </div>
    </header>
  );
}
