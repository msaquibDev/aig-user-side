"use client";

import {
  ArrowLeft,
  FileText,
  FileSignature,
  MonitorPlay,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const sections = [
  {
    label: "Registrations",
    href: "/registration/my-registration",
    icon: FileText,
    key: "registrations",
  },
  {
    label: "Abstract",
    href: "/abstract/my-abstracts",
    icon: FileSignature,
    key: "abstract",
  },
  // {
  //   label: "Travel",
  //   href: "/travel/plan",
  //   icon: Plane,
  //   key: "travel",
  // },
  // {
  //   label: "Accomodation",
  //   href: "/accomodation",
  //   icon: Home,
  //   key: "accomodation",
  // },
  {
    label: "Presentation",
    href: "/presentation/my-presentations",
    icon: MonitorPlay,
    key: "presentation",
  },
];

export const MainSectionSidebar = ({
  activeSection,
  onBackToggle,
  onSectionClick,
  onToggle,
  isOpen,
}: {
  activeSection: string;
  onBackToggle: () => void;
  onToggle?: () => void;
  onSectionClick: (key: string, href: string) => void;
  isOpen: boolean;
}) => {
  const router = useRouter();
  return (
    <aside className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-25 border-r bg-[#eaf3ff] pt-[36px] pb-4 px-2 flex flex-col items-center z-30">
      {/* Back button - always visible */}
      <button
        onClick={() => router.push("/dashboard/events")}
        className="absolute top-10 left-2 text-sm text-gray-700 flex items-center gap-1 hover:text-blue-600 transition cursor-pointer z-40"
      >
        <ChevronLeft className="w-4 h-4 transition-transform duration-300" />
        <span>Back</span>
      </button>

      <nav className="flex flex-col gap-6 mt-10">
        {sections.map(({ label, href, icon: Icon, key }) => {
          const isActive = key === activeSection;
          return (
            <button
              key={label}
              onClick={() => onSectionClick(key, href)}
              className={cn(
                "flex flex-col items-center text-xs font-semibold transition",
                isActive
                  ? "bg-white text-blue-600 shadow-sm border-l-4 border-blue-600 rounded-sm px-2 py-1"
                  : "text-gray-700 hover:text-blue-600 hover:rounded-sm"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[11px]">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
