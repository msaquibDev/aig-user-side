// app/(auth)/layout.tsx
// import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased">
      <main>{children}</main>
    </div>
  );
}