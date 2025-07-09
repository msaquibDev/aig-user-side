"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Menu,
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

export const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-blue-900 text-white">
        <span className="font-semibold">AIG Hospitals</span>
        <button onClick={toggleSidebar}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "lg:relative lg:translate-x-0 lg:flex flex-col w-64 bg-blue-100 p-4 transition-transform duration-300 z-40",
          open ? "absolute top-0 left-0 h-full shadow-xl" : "hidden lg:flex"
        )}
      >
        <div className="hidden lg:block text-lg font-bold text-blue-800 mb-4">
          AIG Hospitals
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
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
      </aside>
    </>
  );
};
