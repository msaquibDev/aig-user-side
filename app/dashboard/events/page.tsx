// app/dashboard/events/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { events } from "../../data/events";
import EventCard from "./components/EventCard";

export default function EventsPage() {
  const [tab, setTab] = useState("all");

  const filteredEvents = events.filter((event) => {
    if (tab === "registered") return event.registered;
    if (tab === "past") return new Date(event.date) < new Date();
    return true; // all
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">My Events</h1>

      <Tabs defaultValue="all" onValueChange={setTab}>
        <TabsList className="flex space-x-6 border-b border-gray-200 mb-4 bg-transparent p-0">
          {[
            { label: "All Events", value: "all" },
            { label: "Registered", value: "registered" },
            { label: "Past Events", value: "past" },
          ].map(({ label, value }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="tab-trigger  cursor-pointer"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab}>
          <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
