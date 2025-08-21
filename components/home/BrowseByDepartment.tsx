"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarDays, MapPin } from "lucide-react";
// import { departments } from "@/app/data/departments";
import { useEventStore } from "@/app/store/useEventStore";
import { formatEventDate } from "@/app/utils/formatEventDate";

export default function BrowseByDepartment() {
  const { events, fetchEvents } = useEventStore();

  const [selectedDept, setSelectedDept] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "">("");

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const router = useRouter();

  const filteredEvents = selectedDept
    ? events.filter(
        (event) => event.department?.departmentName === selectedDept
      )
    : events;

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    if (sortOrder === "latest") return dateB - dateA;
    if (sortOrder === "oldest") return dateA - dateB;
    return 0;
  });

  return (
    <section className="px-4 md:px-12 py-12 bg-white">
      {/* Top Row: Heading + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00509E]">
          Browse By Department
        </h2>

        <div className="flex gap-4">
          <Select onValueChange={(value) => setSelectedDept(value)}>
            <SelectTrigger className="w-[200px] cursor-pointer">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {[
                ...new Set(events.map((e) => e.department?.departmentName)),
              ].map(
                (deptName, idx) =>
                  deptName && (
                    <SelectItem key={idx} value={deptName}>
                      {deptName}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setSortOrder(value as "latest" | "oldest")
            }
          >
            <SelectTrigger className="w-[120px] cursor-pointer">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid or No Results */}
      {sortedEvents.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
          {sortedEvents.map((event) => (
            <Card
              key={event._id}
              className="group flex flex-col rounded-xl overflow-hidden shadow-md border bg-white w-full mx-auto hover:shadow-lg transition-all duration-300 h-full"
              style={{ maxWidth: "350px" }}
            >
              {/* Image container */}
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

                {/* Register Button */}
                <Button
                  onClick={() => router.push(`/login`)}
                  className="mt-4 w-full text-sm py-2 bg-[#00509E] hover:bg-[#003B73] transition-colors cursor-pointer"
                >
                  Register
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
