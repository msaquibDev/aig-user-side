// components/dashboard/MobileSubSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { X, User, Users, MonitorPlay, Utensils } from "lucide-react";

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
  abstract: [],
  travel: [],
  accomodation: [],
  presentation: [],
};

export const MobileSubSidebar = ({
  section,
  isOpen,
  onClose,
}: {
  section: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const items = sidebarMap[section] || [];

  const isBadgePage = pathname.startsWith(
    "/registration/my-registration/badge"
  );

  const eventId = isBadgePage
    ? pathname.split("/").pop()
    : searchParams.get("eventId");
  const registrationId = searchParams.get("registrationId");

  const buildUrl = (basePath: string) => {
    const params = new URLSearchParams();
    if (eventId) params.set("eventId", eventId);
    if (registrationId) params.set("registrationId", registrationId);
    if (isBadgePage) params.set("fromBadge", "true");
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#eaf3ff] z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 p-1 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col space-y-2">
            {items.map(({ label, path, icon: Icon }) => {
              const url = buildUrl(path);
              const isActive =
                pathname === path || pathname.startsWith(path + "/");

              return (
                <Link
                  key={path}
                  href={url}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-white hover:text-blue-600"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
