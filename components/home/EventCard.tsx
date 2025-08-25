"use client";
import { useEffect } from "react";
import { useEventStore } from "@/app/store/useEventStore";

export default function EventsPage() {
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div>
      <h1>Events</h1>
      {events.map((e) => (
        <p key={e._id}>{e.eventName}</p>
      ))}
    </div>
  );
}
