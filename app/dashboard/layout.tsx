// /app/dashboard/layout.tsx
import { ReactNode } from "react";
import "@/app/globals.css";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen">
          <DashboardHeader />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
