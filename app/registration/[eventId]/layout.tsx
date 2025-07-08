import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { events } from "@/app/data/events";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RegistrationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) {
  const event = events.find((e) => e.id === params.eventId);

  if (!event) return notFound();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#EAF1FF] min-h-screen`}
      >
        {/* Top Blue Header */}
        <div className="bg-[#003B73] py-8 px-4 sm:px-8 shadow-md">
          <div className="max-w-4xl mx-auto flex items-start gap-4">
            <img
              src={event.image || "/event-poster.jpg"}
              alt="Event Poster"
              className="w-20 h-28 object-cover rounded shadow-md border"
            />
            <div>
              <h1 className="text-white text-xl sm:text-2xl font-semibold">
                {event.title}
              </h1>
              <p className="text-white text-sm">📅 {event.date}</p>
              <p className="text-white text-sm">📍 {event.location}</p>
            </div>
          </div>
        </div>

        {/* Floating White Card */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 pb-10 relative z-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
            {children}
          </div>
        </main>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
