"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Conferences", href: "/conferences" },
  { label: "Workshops", href: "/workshops" },
  { label: "CMEs", href: "/cmes" },
];

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-[#02075d] to-[#1e3a8a] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/headerImg/logo.png"
            alt="AIG Logo"
            width={120}
            height={40}
          />
        </Link>

        {/* Nav Menu */}
        <nav className="hidden md:flex space-x-8 items-center">
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

        {/* Login / Sign Up Button */}
        <Link href="/account/login">
          <Button
            variant="outline"
            className="border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] hover:border-white transition"
          >
            Login/ Sign Up
          </Button>
        </Link>
      </div>

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
