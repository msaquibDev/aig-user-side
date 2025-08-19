"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { useUserStore } from "@/app/store/useUserStore";
import { useState } from "react";

export function DashboardHeader({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // ✅ Zustand photo (reactive)
  const photo = useUserStore((state) => state.photo);

  const [loggingOut, setLoggingOut] = useState(false);

  // Replace with dynamic values if needed
  const eventTitle = "AIG IBD Summit 2025";
  const eventDateTime = "Sat Aug 2, 2025 | 08:00 PM (IST)";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-r from-[#000d4e] to-[#005aa7] shadow sticky top-0 z-50">
      {/* Left: Logo + Event Info + Hamburger */}
      <div className="flex items-center gap-4">
        {/* Hamburger on small screens */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div onClick={() => router.push("/")} className="cursor-pointer">
          <Image
            src="/headerImg/logo.png"
            alt="AIG Hospitals Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Event Info */}
        <div className="hidden md:flex flex-col justify-center text-white ml-6">
          <h1 className="text-lg font-semibold leading-tight">{eventTitle}</h1>
          <p className="text-sm text-gray-200">{eventDateTime}</p>
        </div>
      </div>

      {/* Right: Avatar + Logout */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => router.push("/dashboard/profile")}
          className="cursor-pointer"
        >
          <Avatar className="border-2 border-purple-600 w-10 h-10 cursor-pointer">
            {/* ✅ Prefer store photo → fallback to session → fallback default */}
            <AvatarImage src={photo || user?.image || "/authImg/user.png"} />
            <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          disabled={loggingOut}
          className="border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] px-4 py-2 cursor-pointer"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
