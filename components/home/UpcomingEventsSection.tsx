"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/app/store/useEventStore";
import { useEffect } from "react";
import { formatEventDate } from "@/app/utils/formatEventDate";

interface UpcomingEventsSectionProps {
  title: string;
  eventCategory: string; // e.g. "Conference", "Workshop", "CME"
  limit?: number; // optional: max items to show
}

export default function UpcomingEventsSection({
  title,
  eventCategory,
  limit,
}: UpcomingEventsSectionProps) {
  const router = useRouter();
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ✅ Filter by category
  const filteredEvents = events.filter(
    (event) => event.eventCategory === eventCategory
  );

  // ✅ If none → don't render section
  if (filteredEvents.length === 0) return null;

  // ✅ Apply limit if provided
  const displayedEvents = limit
    ? filteredEvents.slice(0, limit)
    : filteredEvents;

  // ✅ Auto-generate "View All" link
  const categoryToPath: Record<string, string> = {
    Conference: "/conferences",
    Workshop: "/workshops",
    CME: "/cmes",
  };
  const viewAllLink = categoryToPath[eventCategory];

  return (
    <section className="bg-[#F8FAFC] px-4 md:px-12 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00509E]">
          {title}
        </h2>

        {limit && filteredEvents.length > limit && viewAllLink && (
          <Button
            variant="outline"
            className="text-sm border-gray-300 cursor-pointer"
            onClick={() => router.push(viewAllLink)}
          >
            View All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
        {displayedEvents.map((event) => (
          <Card
            key={event._id}
            className="group flex flex-col rounded-xl overflow-hidden shadow-md border bg-white w-full mx-auto hover:shadow-lg transition-all duration-300 h-full"
            style={{ maxWidth: "350px" }}
          >
            {/* Image */}
            <div
              className="w-full p-0 m-0 overflow-hidden"
              style={{ aspectRatio: "1/1.414" }}
            >
              <img
                src={event.eventImage}
                alt={event.eventName}
                className="w-full h-full object-cover p-0 m-0 block transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow px-4 py-3">
              <div className="flex-grow space-y-2">
                <h3 className="text-lg font-bold text-black line-clamp-2 leading-tight">
                  {event.eventName}
                </h3>

                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                  <CalendarDays className="w-4 h-4 flex-shrink-0 text-[#00509E]" />
                  <span className="truncate">
                    {formatEventDate(event.startDate, event.endDate)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-[#00509E]" />
                  <span className="truncate">{event.city}</span>
                </div>
              </div>

              <Button
                className="mt-4 w-full text-sm py-2 bg-[#00509E] hover:bg-[#003B73] transition-colors duration-200 cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Register
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
