"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Users,
  Hammer,
  UtensilsCrossed,
  Notebook,
  UserPen,
  Presentation,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BackButton from "../common/BackButton";

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
    // { label: 'Accompanying', path: '/registration/accompanying', icon: Users },
    // { label: 'Workshop', path: '/registration/workshop', icon: Hammer },
    // { label: 'Banquet', path: '/registration/banquet', icon: UtensilsCrossed },
    // ],
    // abstract: [
    //   { label: 'My Abstract', path: '/abstract/my-abstracts', icon: Notebook },
    //   { label: 'Authors', path: '/abstract/authors', icon: UserPen },
    // ],
    // presentation: [
    //   {
    //     label: 'My Presentation',
    //     path: '/presentation/my-presentations',
    //     icon: Presentation,
    //   },
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
        "fixed top-[74px] left-25 h-[calc(100vh-74px)] border-r bg-[#eaf3ff] transition-all duration-300 z-30",
        isOpen ? "w-64 px-8 py-4" : "w-0 px-0 py-0 overflow-hidden"
      )}
    >
      <nav className="mt-3 space-y-2 relative">
        {items.map(({ label, path, icon: Icon }, idx) => {
          const isActive = pathname === path;
          // Only for the first menu item (My Registration)
          if (idx === 0) {
            return (
              <div key={path} className="relative flex items-center">
                <Link
                  href={path}
                  className={cn(
                    "flex items-center gap-2 text-sm rounded-md px-3 py-2 font-medium transition w-full",
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-white hover:text-blue-600"
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              </div>
            );
          }
          return (
            <Link
              key={path}
              href={path}
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
