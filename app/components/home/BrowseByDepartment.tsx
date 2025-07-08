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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedEvents.map((event) => (
          <Card
            key={event.id}
            className="rounded-xl overflow-hidden shadow-md border"
          >
            <div className="w-full h-[330px]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <CardContent className="px-4 py-3 space-y-1">
              <h3 className="text-base font-semibold text-black leading-snug">
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

              <Button
                onClick={() => router.push(`/registration/${event.id}`)}
                className="mt-3 w-full text-sm py-1.5 bg-[#00509E] text-white hover:bg-[#003B73]"
              >
                Register
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
