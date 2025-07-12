import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parse, isToday, isAfter, differenceInCalendarDays } from "date-fns";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import Image from "next/image";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  department: string;
  registered?: boolean;
  registrationNo?: string;
  eventType?: "In-Person" | "Virtual"; // Changed from personType to eventType for better semantics
};

function parseEventDate(rawDate: string): Date {
  const firstDate = rawDate.split(" - ")[0].trim();
  return parse(firstDate, "d MMM yyyy", new Date());
}

function getEventStatus(dateStr: string): {
  label: string;
  color: "green" | "blue" | "gray";
} {
  const eventDate = parseEventDate(dateStr);
  const today = new Date();

  if (isToday(eventDate)) return { label: "LIVE", color: "green" };
  if (isAfter(eventDate, today)) {
    const diff = differenceInCalendarDays(eventDate, today);
    return {
      label: `STARTS IN ${diff} DAY${diff !== 1 ? "S" : ""}`,
      color: "blue",
    };
  }
  return { label: "COMPLETED", color: "gray" };
}

export default function EventCard({ event }: { event: Event }) {
  const { label, color } = getEventStatus(event.date);

  const badgeColor = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  }[color];

  return (
    <Card className="flex flex-col sm:flex-row items-start gap-4 p-4 hover:shadow-md transition-shadow">
      <div className="relative w-full sm:w-24 h-32 rounded-md overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 96px"
        />
      </div>

      <div className="flex-1 w-full">
        <CardHeader className="p-0">
          <CardTitle className="text-lg flex flex-wrap items-center gap-2">
            {event.title}
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}
            >
              {label}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-2 space-y-1">
          {event.registered && event.registrationNo && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Ticket className="w-4 h-4" />
              Registration No: {event.registrationNo}
            </p>
          )}

          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <CalendarDays className="w-4 h-4 flex-shrink-0" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{event.location}</span>
          </div>

          {event.eventType && (
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {event.eventType} Event
              </span>
            </div>
          )}

          <div className="mt-3">
            {event.registered ? (
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled
              >
                Registered
              </Button>
            ) : (
              <Button size="sm" className="w-full sm:w-auto">
                Register
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
