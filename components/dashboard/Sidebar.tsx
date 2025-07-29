"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  X,
  CalendarDays,
  ScrollText,
  Megaphone,
  Users,
  History,
} from "lucide-react";

const navItems = [
  { label: "Events", href: "/dashboard/events", icon: CalendarDays },
  {
    label: "My Certificates",
    href: "/dashboard/certificates",
    icon: ScrollText,
  },
  { label: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
  { label: "My Profile", href: "/dashboard/profile", icon: Users },
  { label: "Payment History", href: "/dashboard/payments", icon: History },
];

export const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-blue-100 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:flex"
        )}
      >
        <div className="p-4 space-y-2">
          {/* Close Icon on Mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-blue-800 mb-2 ml-auto block"
          >
            <X size={20} />
          </button>

          <nav className="flex flex-col space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-200 text-sm font-medium",
                  pathname === href
                    ? "bg-white text-blue-800 shadow"
                    : "text-black"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
