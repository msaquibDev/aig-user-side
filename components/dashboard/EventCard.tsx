// components/dashboard/EventCard.tsx
"use client";

import { useState, useEffect } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/app/store/useEventStore";
import { useUserRegistrationsStore } from "@/app/store/useRegistrationStore";
import { formatEventDate } from "@/app/utils/formatEventDate";
import { UserRegistration } from "@/app/store/useRegistrationStore";
import SkeletonCard from "../common/SkeletonCard";

const TABS = ["Registered", "All", "Past"];
const FILTERS = ["All", "CME", "Workshop", "Conference"];

export default function EventTabs() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const { events, fetchEvents } = useEventStore();
  const { registrations, fetchRegistrations } = useUserRegistrationsStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await fetchEvents();
      setLoading(false);
    }
    fetchData();
  }, [fetchEvents, fetchRegistrations]);

  const handleRegister = (eventId?: string) => {
    if (!eventId) return;
    else router.push(`/registration/my-registration?eventId=${eventId}`);
  };

  const handleViewBadge = (eventId?: string, registrationId?: string) => {
    if (!eventId || !registrationId) return;
    router.push(
      `/registration/my-registration/badge/${eventId}?registrationId=${registrationId}`
    );
  };

  // Registered events
  const registeredEvents = registrations
    .filter((r) => r.isPaid)
    .map((r) => ({
      ...events.find((ev) => ev._id === r.eventId),
      registrationId: r._id,
    }))
    .filter((ev) => ev && ev._id);

  // Apply tab + search + filter
  const filteredEvents = (
    activeTab === "Registered"
      ? registeredEvents
      : activeTab === "Past"
      ? registeredEvents.filter(
          (ev) => ev.endDate && new Date(ev.endDate) < new Date()
        )
      : events
  )
    .filter((event) =>
      event?.eventName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((event) =>
      filterType === "All" ? true : event?.eventCategory === filterType
    );

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

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 bg-white"
        />

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 cursor-pointer bg-white">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid / Skeleton / No Results */}
      {loading ? (
        <SkeletonCard count={10} />
      ) : filteredEvents.length === 0 ? (
        <p className="text-gray-500 text-center mt-8 col-span-full">
          No results found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
          {filteredEvents.map((event) => {
            const userReg: UserRegistration | undefined = registrations.find(
              (r) => r.eventId === event._id && r.isPaid
            );
            const isPast =
              !!event.endDate && new Date(event.endDate) < new Date();

            return (
              <Card
                key={event._id}
                className="group relative flex flex-col rounded-xl overflow-hidden shadow-md border bg-white hover:shadow-lg transition-all duration-300 h-full"
              >
                {/* Image */}
                <div
                  className="w-full overflow-hidden"
                  style={{ aspectRatio: "1/1.2" }}
                >
                  <img
                    src={event.eventImage}
                    alt={event.eventName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                      <CalendarDays className="w-4 h-4 text-[#00509E]" />
                      <span className="truncate">
                        {formatEventDate(event.startDate, event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <MapPin className="w-4 h-4 text-[#00509E]" />
                      <span className="truncate">{event.city}</span>
                    </div>
                  </div>

                  {/* Register / View Badge / Completed Button */}
                  {userReg ? (
                    isPast ? (
                      <Button
                        disabled
                        className="mt-4 w-full text-sm py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                      >
                        Completed
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleViewBadge(event._id, userReg._id)}
                        className="mt-4 w-full text-sm py-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                      >
                        View Badge
                      </Button>
                    )
                  ) : (
                    event._id && (
                      <Button
                        onClick={() =>
                          userReg
                            ? handleViewBadge(event._id)
                            : handleRegister(event._id)
                        }
                        disabled={!userReg && isPast}
                        className={`mt-4 w-full text-sm py-2 transition-colors cursor-pointer ${
                          userReg
                            ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                            : isPast
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#00509E] hover:bg-[#003B73]"
                        }`}
                      >
                        {userReg
                          ? "View Badge"
                          : isPast
                          ? "Registration Closed"
                          : "Register"}
                      </Button>
                    )
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
