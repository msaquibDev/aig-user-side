// components/dashboard/MainSectionSidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ClipboardList, FileText, Plane, Bed, Monitor } from "lucide-react";

const sections = [
  { label: "Registrations", key: "registrations", icon: FileText },
  { label: "Abstract", key: "abstract", icon: ClipboardList },
  { label: "Travel", key: "travel", icon: Plane },
  { label: "Accommodation", key: "accomodation", icon: Bed },
  { label: "Presentation", key: "presentation", icon: Monitor },
];

export const MainSectionSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const activeSection = pathname.split("/")[2];

  const handleClick = (key: string) => {
    const defaultPath = {
      registrations: "/dashboard/registrations/my-registration",
      abstract: "/dashboard/abstract",
      travel: "/dashboard/travel",
      accomodation: "/dashboard/accomodation",
      presentation: "/dashboard/presentation",
    }[key];

    if (defaultPath) router.push(defaultPath);
  };

  return (
    <aside className="hidden lg:flex flex-col w-45 bg-[#e0ecff] border-r border-gray-300 p-4 fixed top-[80px] left-0 h-[calc(100vh-80px)] z-40">
      {/* <div className="text-lg font-semibold text-blue-900 mb-4 pl-1">
        Sections
      </div> */}
      <nav className="space-y-1">
        {sections.map(({ label, key, icon: Icon }) => {
          const isActive = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={cn(
                "w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                isActive
                  ? "bg-white text-blue-800 shadow"
                  : "text-gray-800 hover:bg-blue-200"
              )}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
