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
import { Suspense } from "react";
import Loading from "../common/Loading";

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
  ],
  abstract: [
    { label: "My Abstract", path: "/abstract/my-abstracts", icon: Notebook },
    { label: "Authors", path: "/abstract/authors", icon: UserPen },
  ],
  presentation: [
    {
      label: "My Presentation",
      path: "/presentation/my-presentations",
      icon: Presentation,
    },
  ],
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

  const isBadgePage = pathname.startsWith(
    "/registration/my-registration/badge"
  );

  return (
    <Suspense fallback={<Loading />}>
      {/* Chevron toggle button (always visible) */}

      {/* Sub Sidebar */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed top-[95px] z-[70] bg-white border border-blue-200 shadow rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-blue-50",
          "transition-all duration-300 cursor-pointer",
          isOpen
            ? "left-[calc(100px+256px-30px)]" // main sidebar (100px) + subsidebar (256px) + small gap
            : "left-[calc(100px-16px)]" // only main sidebar width + gap
        )}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-blue-600" />
        )}
      </button>
      <aside
        className={cn(
          "fixed top-[74px] left-[100px] h-[calc(100vh-74px)] border-r bg-[#eaf3ff] transition-all duration-300 z-30",
          isOpen ? "w-60 px-6" : "w-0 px-0 py-0 overflow-hidden"
        )}
      >
        <nav className="mt-6 flex flex-col space-y-2 relative">
          {items.map(({ label, path, icon: Icon }) => {
            const isActive =
              pathname === path ||
              (isBadgePage && path === "/registration/my-registration");

            const content = (
              <div
                className={cn(
                  "flex items-center gap-2 text-sm rounded-md px-3 py-2 font-medium w-full transition",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm cursor-not-allowed"
                    : "text-gray-700 hover:bg-white hover:text-blue-600"
                )}
              >
                <Icon size={16} />
                <span>{label}</span>
              </div>
            );

            // Disable link when on badge page
            if (isBadgePage && path === "/registration/my-registration") {
              return <div key={path}>{content}</div>;
            }

            return (
              <Link key={path} href={path}>
                {content}
              </Link>
            );
          })}
        </nav>
      </aside>
    </Suspense>
  );
}
