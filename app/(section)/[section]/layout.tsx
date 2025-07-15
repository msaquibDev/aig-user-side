// app/(section)/[section]/layout.tsx
"use client";

import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";
import { MainSectionSidebar } from "@/app/components/dashboard/MainSectionSidebar";
import { SubSidebar } from "@/app/components/dashboard/SubSidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function SectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("");
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

  const handleSectionClick = (key: string, href: string) => {
    setActiveSection(key);
    setSubSidebarOpen(true);
    router.push(href);
  };

  return (
    <>
      <DashboardHeader />
      <MainSectionSidebar
        activeSection={activeSection}
        onBackToggle={() => setSubSidebarOpen((prev) => !prev)}
        onSectionClick={handleSectionClick}
      />
      <SubSidebar
        section={activeSection}
        isOpen={subSidebarOpen}
        onToggle={() => setSubSidebarOpen((prev) => !prev)}
      />
      <main
        className={`ml-[${subSidebarOpen ? "20rem" : "5rem"}] mt-[60px] p-6`}
      >
        {children}
      </main>
    </>
  );
}
