"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Users,
  Hammer,
  Utensils,
  FileText,
  ClipboardList,
  Plane,
  Bed,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const subNavMap: Record<
  string,
  { label: string; href: string; icon: React.ElementType }[]
> = {
  registrations: [
    {
      label: "My Registration",
      href: "/dashboard/registrations/my-registration",
      icon: FileText,
    },
    {
      label: "Accompanying",
      href: "/dashboard/registrations/accompanying",
      icon: Users,
    },
    {
      label: "Workshop",
      href: "/dashboard/registrations/workshop",
      icon: Hammer,
    },
    {
      label: "Banquet",
      href: "/dashboard/registrations/banquet",
      icon: Utensils,
    },
  ],
  abstract: [
    { label: "Abstract", href: "/dashboard/abstract", icon: ClipboardList },
  ],
  travel: [{ label: "Travel Details", href: "/dashboard/travel", icon: Plane }],
  accomodation: [
    { label: "Accommodation", href: "/dashboard/accomodation", icon: Bed },
  ],
  presentation: [
    { label: "Presentation", href: "/dashboard/presentation", icon: Monitor },
  ],
};

export const SubSidebar = ({
  section,
  onClose,
}: {
  section: string;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const items = subNavMap[section];

  if (!items) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed top-[80px] left-45 h-[calc(100vh-80px)] z-40 shadow-sm">
      {/* Top bar with close icon */}
      <div className="h-[32px] border-b border-blue-200 bg-blue-100 px-3 flex items-center justify-between">
        <span className="text-sm font-medium text-blue-900 capitalize">
          {section.replace(/-/g, " ")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-blue-900 hover:bg-blue-200"
        >
          <ChevronLeft size={18} />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                isActive
                  ? "bg-blue-100 text-blue-800 shadow"
                  : "text-gray-800 hover:bg-blue-50"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
