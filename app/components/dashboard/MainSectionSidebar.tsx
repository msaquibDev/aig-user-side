"use client";

import {
  ArrowLeft,
  FileText,
  FileSignature,
  Plane,
  Home,
  MonitorPlay,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Registrations",
    href: "/registration/my-registration",
    icon: FileText,
    key: "registrations",
  },
  {
    label: "Abstract",
    href: "/abstract/submit",
    icon: FileSignature,
    key: "abstract",
  },
  {
    label: "Travel",
    href: "/travel/plan",
    icon: Plane,
    key: "travel",
  },
  {
    label: "Accomodation",
    href: "/accomodation",
    icon: Home,
    key: "accomodation",
  },
  {
    label: "Presentation",
    href: "/presentation",
    icon: MonitorPlay,
    key: "presentation",
  },
];

export const MainSectionSidebar = ({
  activeSection,
  onBackToggle,
  onSectionClick,
}: {
  activeSection: string;
  onBackToggle: () => void;
  onSectionClick: (key: string, href: string) => void;
}) => {
  return (
    <aside className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-20 border-r bg-[#eaf3ff] pt-[36px] pb-4 px-2 flex flex-col items-center z-30">
      <button
        className="text-sm text-gray-700 flex items-center gap-1 mb-6 hover:text-blue-600"
        onClick={onBackToggle}
      >
        <ArrowLeft size={16} />
        <span className="hidden lg:inline-block">Back</span>
      </button>

      <nav className="flex flex-col gap-6">
        {sections.map(({ label, href, icon: Icon, key }) => {
          const isActive = key === activeSection;
          return (
            <button
              key={label}
              onClick={() => onSectionClick(key, href)}
              className={cn(
                "flex flex-col items-center text-xs font-semibold transition",
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
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
