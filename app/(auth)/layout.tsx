<<<<<<< HEAD
import { SessionProvider } from "next-auth/react";
=======
<<<<<<< HEAD
>>>>>>> 30caa6215b3a63fa0aababb2fb18818abec895a1
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
<<<<<<< HEAD
        <SessionProvider>{children}</SessionProvider>
=======
        {children}
=======
// app/layout.tsx
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
>>>>>>> backend
>>>>>>> 30caa6215b3a63fa0aababb2fb18818abec895a1
      </body>
    </html>
  );
}
