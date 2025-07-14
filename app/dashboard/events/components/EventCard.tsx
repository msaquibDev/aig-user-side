"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import clsx from "clsx";

const dummyEvents = [
  {
    id: "1",
    title: "AIG IBD Summit 2025",
    dateRange: "25 Apr 2025 – 27 Apr 2025",
    location: "HICC Novotel, Hyderabad, India",
    eventType: "In-Person Event",
    image: "/eventImg/event1.png",
    status: "upcoming", // live | past | upcoming
    registered: true,
    daysLeft: 2,
  },
  {
    id: "2",
    title: "Gut, Liver & Lifelines",
    dateRange: "1 Jun 2025",
    location: "Auditorium, AIG Hospitals",
    eventType: "In-Person Event",
    image: "/eventImg/event2.jpg",
    status: "live",
    registered: true,
  },
  {
    id: "3",
    title: "Tiny Guts Symposium",
    dateRange: "1 June 2025",
    location: "Auditorium, AIG Hospitals",
    eventType: "In-Person Event",
    image: "/eventImg/event3.png",
    // status: "past",
    registered: false,
  },
  {
    id: "4",
    title: "Tiny Guts Symposium",
    dateRange: "1 June 2025",
    location: "Auditorium, AIG Hospitals",
    eventType: "In-Person Event",
    image: "/eventImg/event4.jpg",
    status: "past",
    registered: false,
  },
];

const TABS = ["Registered", "All", "Past"];

export default function EventTabs() {
  const [activeTab, setActiveTab] = useState("Registered");

  const filteredEvents = dummyEvents.filter((event) => {
    if (activeTab === "Registered") return event.registered;
    if (activeTab === "Past") return event.status === "past";
    return true;
  });

  return (
    <section className="px-4 md:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">Events</h1>
      {/* Tabs */}
      <div className="flex gap-6 text-sm font-medium text-blue-900 border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "pb-2 transition-all cursor-pointer",
              activeTab === tab
                ? "border-b-2 border-blue-800 text-blue-900"
                : "text-gray-500 hover:text-blue-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            style={{ maxWidth: "350px" }}
            className={clsx(
              "flex flex-col rounded-xl overflow-hidden shadow-md border w-full mx-auto h-full"
              // event.registered ? "ring-2 ring-blue-500" : ""
            )}
          >
            {/* Image */}
            <div className="aspect-[3/4] w-full">
              <Image
                src={event.image}
                alt={event.title}
                width={400}
                height={500}
                className="w-full h-full object-cover p-0 m-0 block"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow px-4 py-3">
              <div className="flex-grow space-y-2">
                <h4 className="text-lg font-bold text-black line-clamp-2 leading-tight">
                  {event.title}
                </h4>
                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                  <CalendarDays className="w-4 h-4 flex-shrink-0" />{" "}
                  <span className="truncate">{event.dateRange}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Ticket className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{event.eventType}</span>
                </div>

                {/* Footer Badge */}
                {/* Footer Action or Badge */}
                <div className="mt-4">
                  {event.status === "live" ? (
                    <div className="w-full bg-green-100 text-green-800 text-xs font-semibold text-center px-3 py-1.5 rounded-md">
                      ✅ Event is Live
                    </div>
                  ) : event.status === "past" ? (
                    <div className="w-full bg-gray-100 text-gray-700 text-xs font-semibold text-center px-3 py-1.5 rounded-md">
                      🕓 Completed
                    </div>
                  ) : event.registered ? (
                    <div className="w-full bg-blue-100 text-blue-800 text-xs font-semibold text-center px-3 py-1.5 rounded-md">
                      ⏳ Starts in {event.daysLeft} Days
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-[#00509E] hover:bg-[#003B73] text-white text-xs font-semibold py-2 rounded-md"
                      onClick={() => alert("Register")}
                    >
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
