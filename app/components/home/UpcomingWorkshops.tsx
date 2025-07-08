"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { workshops } from "../../data/workshops";

export default function UpcomingWorkshops() {
  return (
    <section className="bg-[#F8FAFC] px-4 md:px-12 py-12">
      {/* Heading + View All */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Upcoming Workshops
        </h2>
        <Button variant="outline" className="text-sm border-gray-300">
          View All
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workshops.map((event) => (
          <Card
            key={event.id}
            className="rounded-xl overflow-hidden shadow-md border bg-white"
          >
            {/* Poster */}
            <div className="w-full h-[330px]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <CardContent className="px-4 py-3 space-y-1">
              <h3 className="text-base font-semibold text-black leading-snug line-clamp-2">
                {event.title}
              </h3>

              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{event.date}</span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>

              <Button className="mt-3 w-full text-sm py-1.5 bg-[#00509E] text-white hover:bg-[#003B73]">
                Register
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
