"use client";
import "@/app/globals.css";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MainSectionSidebar } from "../components/dashboard/MainSectionSidebar";
import { SubSidebar } from "../components/dashboard/SubSidebar";

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeSection, setActiveSection] = useState("registrations");
  const [subSidebarOpen, setSubSidebarOpen] = useState(true);

  useEffect(() => {
    if (pathname.includes("/registration")) setActiveSection("registrations");
    else if (pathname.includes("/abstract")) setActiveSection("abstract");
    else if (pathname.includes("/travel")) setActiveSection("travel");
    else if (pathname.includes("/accomodation"))
      setActiveSection("accomodation");
    else if (pathname.includes("/presentation"))
      setActiveSection("presentation");
  }, [pathname]);

  const handleSectionClick = (key: string, path: string) => {
    setActiveSection(key);
    setSubSidebarOpen(true);
    router.push(path);
  };

  return (
    <html>
      <body className="h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <DashboardHeader />
        </div>

        {/* Below Header Layout */}
        <div className="flex pt-[60px] h-screen overflow-hidden">
          {/* Fixed Left Sidebar */}
          <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-20 z-40 border-r bg-[#eaf3ff]">
            <MainSectionSidebar
              activeSection={activeSection}
              onBackToggle={() => setSubSidebarOpen((prev) => !prev)}
              onSectionClick={handleSectionClick}
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
    flex-1 overflow-y-auto w-full bg-gray-100 p-4 transition-all duration-300
    ${subSidebarOpen ? "ml-[20rem]" : "ml-[5rem]"}
  `}
            style={{
              marginTop: 0,
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
