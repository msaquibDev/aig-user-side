// app/(section)/layout.tsx (Keep this one, delete the other)
"use client";

import "@/app/globals.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MainSectionSidebar } from "@/components/dashboard/MainSectionSidebar";
import { MobileSectionSidebar } from "@/components/dashboard/MobileSectionSidebar";
import { MobileSubSidebar } from "@/components/dashboard/MobileSubSidebar";
import { SubSidebar } from "@/components/dashboard/SubSidebar";
import { PanelRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useMemo } from "react";

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine initial section from pathname
  const initialSection = useMemo(() => {
    if (pathname.includes("/abstract")) return "abstract";
    if (pathname.includes("/travel")) return "travel";
    if (pathname.includes("/accomodation")) return "accomodation";
    if (pathname.includes("/presentation")) return "presentation";
    return "registrations";
  }, [pathname]);

  const [activeSection, setActiveSection] = useState(initialSection);
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);
  const [mobileMainSidebarOpen, setMobileMainSidebarOpen] = useState(false);
  const [mobileSubSidebarOpen, setMobileSubSidebarOpen] = useState(false);

  const handleSectionClick = (key: string, path: string) => {
    setActiveSection(key);
    setSubSidebarOpen(true);
    router.push(path);
  };

  const handleMobileMenuToggle = () => {
    setMobileMainSidebarOpen(true);
  };

  const handleMobileSubMenuToggle = () => {
    setMobileSubSidebarOpen(true);
  };

  return (
    <ProtectedRoute>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader onMenuToggle={handleMobileMenuToggle} />
      </div>

      {/* Mobile Sidebars */}
      <MobileSectionSidebar
        isOpen={mobileMainSidebarOpen}
        onClose={() => setMobileMainSidebarOpen(false)}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      <MobileSubSidebar
        section={activeSection}
        isOpen={mobileSubSidebarOpen}
        onClose={() => setMobileSubSidebarOpen(false)}
      />

      <div className="flex pt-[60px] h-screen overflow-hidden bg-gradient-to-br from-gray-50/50 to-blue-50/30">
        {/* Desktop Main Sidebar */}
        <MainSectionSidebar
          activeSection={activeSection}
          onBackToggle={() => setSubSidebarOpen((prev) => !prev)}
          onSectionClick={handleSectionClick}
          isOpen={subSidebarOpen}
        />

        {/* Desktop Sub Sidebar - Direct component without wrapper div */}
        <SubSidebar
          section={activeSection}
          isOpen={subSidebarOpen}
          onToggle={() => setSubSidebarOpen((prev) => !prev)}
        />

        {/* Mobile Sub Sidebar Toggle Button - Enhanced */}
        <button
          onClick={handleMobileSubMenuToggle}
          className="lg:hidden fixed top-[85px] left-2 z-30 bg-white border-2 border-blue-100 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-200 group"
          aria-label="Open sub menu"
        >
          <PanelRight className="w-5 h-5 text-blue-600 transition-transform group-hover:scale-110" />
        </button>

        {/* Enhanced Content Area */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 bg-white/80 backdrop-blur-sm ${
            subSidebarOpen ? "lg:ml-[336px]" : "lg:ml-[80px]"
          }`}
        >
          <div className="min-h-full p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
