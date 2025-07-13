"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";
import { MainSectionSidebar } from "@/app/components/dashboard/MainSectionSidebar";
import { SubSidebar } from "@/app/components/dashboard/SubSidebar";

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const section = pathname?.split("/")[2] || "";

  const showableSections = [
    "registrations",
    "abstract",
    "travel",
    "accomodation",
    "presentation",
  ];

  const isSubSidebarRoute = showableSections.includes(section);
  const [showSubSidebar, setShowSubSidebar] = useState(true);

  // Automatically open sub-sidebar when navigating to a sub route
  useEffect(() => {
    if (isSubSidebarRoute) {
      setShowSubSidebar(true);
    }
  }, [section]);

  return (
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader />
      </div>

      <div className="flex h-full pt-[80px]">
        {/* Main Sidebar */}
        <MainSectionSidebar />

        {/* Sub Sidebar */}
        {showSubSidebar && isSubSidebarRoute && (
          <SubSidebar
            section={section}
            onClose={() => setShowSubSidebar(false)}
          />
        )}

        {/* Toggle Button to Reopen Sub Sidebar */}
        {!showSubSidebar && isSubSidebarRoute && (
          <div className="hidden lg:block fixed top-[100px] left-[calc(11rem-11px)] z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSubSidebar(true)}
              className="bg-white border border-gray-300 hover:bg-blue-100 shadow rounded-full w-8 h-8"
            >
              <ChevronRight size={16} className="text-blue-900" />
            </Button>
          </div>
        )}

        {/* Page Content */}
        <main
          className={`flex-1 overflow-y-auto bg-gray-100 p-4 transition-all duration-300 ${
            showSubSidebar && isSubSidebarRoute ? "lg:ml-[27rem]" : "lg:ml-45"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
