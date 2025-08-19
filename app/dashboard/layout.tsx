"use client";
import "@/app/globals.css";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html>
      <body className="h-screen overflow-hidden">
        <SessionProviderWrapper>
          <div className="flex h-screen w-screen overflow-hidden">
            {/* Fixed Sidebar (starts after header) */}
            <div className="hidden lg:block fixed top-[80px] left-0 h-[calc(100vh-60px)] w-64 z-40 bg-blue-100">
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </div>

            {/* Header + Content */}
            <div className="flex flex-col flex-1 w-full lg:ml-64">
              {/* Header fixed at top */}
              <div className="fixed top-0 left-0 right-0 z-50">
                <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />
              </div>

              {/* Scrollable content below header */}
              <main className="mt-[60px] flex-1 overflow-y-auto bg-gray-100 p-4">
                {children}
                <Toaster position="top-right" richColors />
              </main>
            </div>
          </div>
          {/* Sidebar (responsive) */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
