// app/dashboard/layout.tsx - FIXED
"use client";
import { ReactNode, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        {/* Header - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />
        </div>

        {/* Sidebar - Starts below header */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 lg:ml-64 w-full transition-all duration-300 mt-[60px]">
          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
