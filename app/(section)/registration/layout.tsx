"use client";

import "@/app/globals.css";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MainSectionSidebar } from "@/components/dashboard/MainSectionSidebar";
import { SubSidebar } from "@/components/dashboard/SubSidebar";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

import { useRouter, usePathname } from "next/navigation";
import Script from "next/script";
import { Suspense, useState } from "react";

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const initialSection = pathname.includes("/abstract")
    ? "abstract"
    : pathname.includes("/travel")
    ? "travel"
    : pathname.includes("/accomodation")
    ? "accomodation"
    : pathname.includes("/presentation")
    ? "presentation"
    : "registrations";

  const [activeSection, setActiveSection] = useState(initialSection);
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);

  const handleSectionClick = (key: string, path: string) => {
    setActiveSection(key);
    setSubSidebarOpen(true);
    router.push(path);
  };

  return (
    <html>
      <body className="h-screen overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <SessionProviderWrapper>
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <DashboardHeader
              onMenuToggle={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>

          {/* Below Header Layout */}
          <div className="flex pt-[60px] h-screen overflow-hidden">
            {/* Fixed Left Sidebar */}
            <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-20 z-40 border-r bg-[#eaf3ff]">
              <MainSectionSidebar
                activeSection={activeSection}
                onBackToggle={() => setSubSidebarOpen((prev) => !prev)}
                onSectionClick={handleSectionClick}
                isOpen={subSidebarOpen}
              />
            </div>

            {/* Fixed Sub Sidebar */}
            <div
              className={`fixed top-[60px] left-20 z-30 h-[calc(100vh-60px)] transition-all duration-300 border-r bg-[#eaf3ff] ${
                subSidebarOpen ? "w-64 px-4 py-6" : "w-0 p-0 overflow-hidden"
              }`}
            >
              <SubSidebar
                section={activeSection}
                isOpen={subSidebarOpen}
                onToggle={() => setSubSidebarOpen((prev) => !prev)}
              />
            </div>

            {/* Scrollable Content */}
            <main
              className={`
              flex-1 overflow-y-auto w-full bg-white p-4 transition-all duration-300
              ${subSidebarOpen ? "ml-[22rem]" : "ml-[5rem]"}
            `}
            >
              {children}
            </main>
          </div>
        </SessionProviderWrapper>
    </Suspense>
      </body>
    </html>
  );
}
