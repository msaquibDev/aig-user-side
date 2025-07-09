"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DashboardHeader = () => {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#000d4e] to-[#005aa7] shadow">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Image
          src="/headerImg/logo.png" // <-- adjust path as needed
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
