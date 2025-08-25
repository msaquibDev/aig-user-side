// app/layout.tsx
// import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="antialiased">
          <Toaster richColors position="top-right" />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
