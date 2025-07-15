"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { departments } from "../../data/departments";
import { events } from "../../data/events";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarDays, MapPin } from "lucide-react";

export default function BrowseByDepartment() {
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "">("");

  const router = useRouter();

  const filteredEvents = selectedDept
    ? events.filter((event) => event.department === selectedDept)
    : events;

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (sortOrder === "latest") return dateB - dateA;
    if (sortOrder === "oldest") return dateA - dateB;
    return 0;
  });

  return (
    <section className="px-4 md:px-12 py-12 bg-white">
      {/* Top Row: Heading + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Browse By Department
        </h2>

        <div className="flex gap-4">
          <Select onValueChange={(value) => setSelectedDept(value)}>
            <SelectTrigger className="w-[200px] cursor-pointer">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
        {sortedEvents.map((event) => (
          <Card
            key={event.id}
            className="flex flex-col rounded-xl overflow-hidden shadow-md border w-full mx-auto h-full"
            style={{ maxWidth: "350px" }}
          >
            {/* Image container - perfectly flush with edges */}
            <div
              className="aspect-[3/4] w-full"
              // style={{ aspectRatio: "1/1.414" }}
            >
              <img
                src={event.image}
                alt={event.title}
                width={400}
                height={500}
                className="w-full h-full object-cover p-0 m-0 block"
              />
            </div>

            {/* Content area with flex-grow to push button down */}
            <div className="flex flex-col flex-grow px-4 py-3">
              <div className="flex-grow space-y-2">
                <h3 className="text-lg font-bold text-black line-clamp-2 leading-tight">
                  {event.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                  <CalendarDays className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Button will now always be at the bottom */}
              <Button
                onClick={() => router.push(`/login`)}
                className="mt-4 w-full text-sm py-2 bg-[#00509E] hover:bg-[#003B73] transition-colors"
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
