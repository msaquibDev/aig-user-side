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
import BackButton from "../common/BackButton";

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
  return (
    <aside className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-25 border-r bg-[#eaf3ff] pt-[36px] pb-4 px-2 flex flex-col items-center z-30">
      <BackButton open={isOpen} onToggle={onToggle} />

      <button
        onClick={onBackToggle}
        className={cn(
          'absolute right-[-20px] z-40 bg-white border border-blue-200 shadow rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-blue-50',
          !isOpen && 'border-gray-300'
        )}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-blue-600" />
        )}
      </button>

      <nav className="flex flex-col gap-6 mt-6">
        {sections.map(({ label, href, icon: Icon, key }) => {
          const isActive = key === activeSection
          return (
            <button
              key={label}
              onClick={() => onSectionClick(key, href)}
              className={cn(
                'flex flex-col items-center text-xs font-semibold transition',
                isActive
                  ? 'bg-white text-blue-600 shadow-sm border-l-4 border-blue-600 rounded-sm px-2 py-1'
                  : 'text-gray-700 hover:text-blue-600 hover:rounded-sm'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[11px]">{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
};
