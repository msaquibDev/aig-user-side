// app/layout.tsx
import type { Metadata } from "next";

// Import your global CSS file
import "./globals.css";

export const metadata: Metadata = {
  title: "AIG User",
  description: "AIG User Application",
  keywords: ["AIG", "User", "Application"],
  authors: [{ name: "AIG Team", url: "https://aig.com" }],
  openGraph: {
    title: "AIG User",
    description: "AIG User Application",
    url: "https://aig.com",
    siteName: "AIG",
    images: [
      {
        url: "https://aig.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AIG User Application",
      },
    ],
  },
};

// This is the Root Layout. It MUST define <html> and <body> tags.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* This is where your app's shared UI will be rendered */}
        {children}
      </body>
    </html>
  );
}
