"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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

  return (
    <header className="w-full bg-gradient-to-r from-[#02075d] to-[#1e3a8a] text-white">
      <div className="mx-auto max-w-8xl px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/headerImg/logo.png"
            alt="AIG Logo"
            width={120}
            height={40}
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

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Login / Signup (Always Visible) */}
        <Link href="/login" className="hidden md:inline-block">
          <Button
            variant="outline"
            className="border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68] hover:border-white transition cursor-pointer"
          >
            Login / Sign Up
          </Button>
        </Link>
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
          <Link href="/login">
            <Button
              variant="outline"
              className="mt-2 w-full border border-white text-white bg-transparent hover:bg-white hover:text-[#0a1f68]"
            >
              Login / Sign Up
            </Button>
          </Link>
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
