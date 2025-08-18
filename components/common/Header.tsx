"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { useUserStore } from "@/app/store/useUserStore";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Department", href: "#department" },
  { label: "Conferences", href: "#conferences" },
  { label: "Workshops", href: "#workshops" },
  { label: "CMEs", href: "#cmes" },
  { label: "About Us", href: "#about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  const { photo, fullName, setUser } = useUserStore();

  // keep Zustand store in sync with session user
  useEffect(() => {
    if (user) {
      setUser({
        photo: user.image || "/authImg/user.png",
        fullName: user.name || "",
      });
    }
  }, [user, setUser]);

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({ redirect: false });
      setUser({ photo: "/authImg/user.png", fullName: "" }); // reset
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#02075d] to-[#1e3a8a] text-white sticky top-0 z-50">
      <div className="mx-auto max-w-8xl px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/headerImg/logo.png"
            alt="AIG Logo"
            width={120}
            height={40}
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-white hover:opacity-90 transition"
            >
              <span className="hover-underline">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Side (Auth conditional) */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard/profile">
                <Avatar className="border-2 border-purple-600 w-10 h-10 cursor-pointer">
                  <AvatarImage
                    src={photo || user?.image || "/authImg/user.png"}
                  />
                  <AvatarFallback>
                    {user?.name?.[0] ?? fullName?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                disabled={loggingOut}
                className="border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] px-4 py-2 cursor-pointer"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="mt-2 w-full border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] cursor-pointer"
              >
                Login / Sign Up
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block text-white py-2 border-b border-white/20"
            >
              {item.label}
            </Link>
          ))}
          {!isLoggedIn ? (
            <Link href="/login">
              <Button
                variant="outline"
                className="mt-2 w-full border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] cursor-pointer"
              >
                Login / Sign Up
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] px-4 py-2 cursor-pointer"
            >
              Logout
            </Button>
          )}
        </div>
      )}

      {/* Hover underline effect */}
      <style jsx>{`
        .hover-underline::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: white;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .hover-underline:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </header>
  );
}
