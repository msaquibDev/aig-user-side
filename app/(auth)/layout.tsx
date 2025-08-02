import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
