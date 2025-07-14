"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DashboardHeader = ({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) => {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-r from-[#000d4e] to-[#005aa7] shadow sticky top-0 z-50">
      {/* Left: Logo + Hamburger for mobile */}
      <div className="flex items-center gap-4">
        {/* Hamburger on small screens */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Image
          src="/headerImg/logo.png"
          alt="AIG Hospitals Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Right: Avatar + Logout */}
      <div className="flex items-center gap-4">
        <Avatar className="border-2 border-purple-600 w-10 h-10">
          <AvatarImage src="/authImg/user.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Button
          onClick={() => router.push("/auth/login")}
          variant="outline"
          className="border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] px-4 py-2"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};
