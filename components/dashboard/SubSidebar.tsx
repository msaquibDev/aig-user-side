"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  User,
  Users,
  PanelLeft,
  PanelRight,
  MonitorPlay,
  Utensils,
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
    { label: "Accompanying", path: "/registration/accompanying", icon: Users },
    {
      label: "Workshop",
      path: "/registration/workshop",
      icon: MonitorPlay,
    },
    {
      label: "Banquet",
      path: "/registration/banquet",
      icon: Utensils,
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
  const searchParams = useSearchParams();
  const items = sidebarMap[section] || [];

  const isBadgePage = pathname.startsWith(
    "/registration/my-registration/badge"
  );

  // Get parameters from current URL
  const eventId = isBadgePage
    ? pathname.split("/").pop()
    : searchParams.get("eventId");
  const registrationId = searchParams.get("registrationId");

  // Function to build URLs with preserved parameters
  const buildUrl = (basePath: string) => {
    const params = new URLSearchParams();

    if (eventId) params.set("eventId", eventId);
    if (registrationId) params.set("registrationId", registrationId);
    if (isBadgePage) params.set("fromBadge", "true");

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <Suspense fallback={<Loading />}>
      {/* Enhanced Chevron toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "hidden lg:flex fixed top-[93px] z-[70] bg-white border-2 border-blue-100 shadow-lg rounded-full w-10 h-10 items-center justify-center transition-all duration-300 cursor-pointer group hover:shadow-xl hover:scale-105 hover:border-blue-200",
          isOpen
            ? "left-[336px]" // 80px (main) + 256px (sub) - adjust as needed
            : "left-[88px]" // 80px (main) + 8px margin
        )}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <PanelLeft className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
        ) : (
          <PanelRight className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
        )}
      </button>

      {/* Enhanced Sub Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-[60px] left-[80px] h-[calc(100vh-60px)] border-r transition-all duration-300 z-30 bg-gradient-to-b from-blue-50/95 to-indigo-50/95 backdrop-blur-sm shadow-xl",
          isOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <div
          className={cn(
            "h-full w-64 transition-opacity duration-200 flex flex-col",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Header */}
          <div className="p-6 border-b border-blue-100/50 bg-white/80">
            <h3 className="font-semibold text-gray-800 text-lg">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your registration
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {items.map(({ label, path, icon: Icon }) => {
              const url = buildUrl(path);
              const isActive =
                pathname === path || pathname.startsWith(path + "/");

              return (
                <Link key={path} href={url}>
                  <div
                    className={cn(
                      "flex items-center gap-3 text-sm rounded-xl px-4 py-3 font-medium w-full transition-all duration-200 group cursor-pointer border border-transparent",
                      isActive
                        ? "bg-white text-blue-700 shadow-md border-blue-200 shadow-blue-100"
                        : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md hover:border-blue-100"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      )}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="font-medium">{label}</span>

                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </Suspense>
  );
}
