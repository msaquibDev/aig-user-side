"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Users,
  Hammer,
  UtensilsCrossed,
  Pencil,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  path: string;
  icon: React.ElementType;
};

const sidebarMap: Record<string, SidebarItem[]> = {
  registrations: [
    {
      label: "My Registration",
      path: "/registration/my-registration",
      icon: User,
    },
    { label: "Accompanying", path: "/registration/accompanying", icon: Users },
    { label: "Workshop", path: "/registration/workshop", icon: Hammer },
    { label: "Banquet", path: "/registration/banquet", icon: UtensilsCrossed },
  ],
  abstract: [
    { label: "Submit Abstract", path: "/abstract/submit", icon: Pencil },
    { label: "My Abstracts", path: "/abstract/my-abstracts", icon: FileText },
  ],
  // Add more...
};

export function SubSidebar({
  section,
  isOpen,
  onToggle,
}: {
  section: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const items = sidebarMap[section] || [];

  return (
    <aside
      className={cn(
        "fixed top-[74px] left-20 h-[calc(100vh-74px)] border-r bg-[#eaf3ff] transition-all duration-300 z-30",
        isOpen ? "w-64 px-3 py-4" : "w-0 px-0 py-0 overflow-hidden"
      )}
    >
      <nav className="space-y-2">
        {items.map(({ label, path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              onClick={onToggle}
              className={cn(
                "flex items-center gap-2 text-sm rounded-md px-3 py-2 font-medium transition",
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-700 hover:bg-white hover:text-blue-600"
              )}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
