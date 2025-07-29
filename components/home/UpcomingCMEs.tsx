"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { cmes } from "@/app/data/cmes"; // Assuming you have a data file for CMEs

export default function UpcomingCMEs() {
  return (
    <section className="bg-[#F8FAFC] px-4 md:px-12 py-12">
      {/* Heading + View All */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Upcoming CMEs
        </h2>
        <Button variant="outline" className="text-sm border-gray-300">
          View All
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
        {cmes.map((event) => (
          <Card
            key={event.id}
            className="flex flex-col rounded-xl overflow-hidden shadow-md border bg-white w-full mx-auto hover:shadow-lg transition-shadow h-full"
            style={{ maxWidth: "350px" }}
          >
            {/* Image container with perfect edge alignment and hover effect */}
            <div
              className="w-full p-0 m-0 relative"
              style={{ aspectRatio: "1/1.414" }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover p-0 m-0 block hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Content area with flex-grow to push button down */}
            <div className="flex flex-col flex-grow px-4 py-3">
              <div className="flex-grow space-y-2">
                <h3 className="text-lg font-bold text-black line-clamp-2 leading-tight group-hover:text-[#00509E] transition-colors">
                  {event.title}
                </h3>

                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                  <CalendarDays className="w-4 h-4 flex-shrink-0 text-[#00509E]" />
                  <span className="truncate">{event.date}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-[#00509E]" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Button now consistently at bottom */}
              <Button className="mt-4 w-full text-sm py-2 bg-[#00509E] hover:bg-[#003B73] transition-colors duration-300 shadow-md hover:shadow-lg">
                Register
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
