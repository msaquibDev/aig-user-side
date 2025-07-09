import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import {
  parse,
  isToday,
  isAfter,
  isBefore,
  differenceInCalendarDays,
} from "date-fns";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  department: string;
  registered?: boolean;
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
      label: `STARTS IN ${diff} DAY${diff > 1 ? "S" : ""}`,
      color: "blue",
    };
  }
  return { label: "COMPLETED", color: "gray" };
}

export default function EventCard({ event }: { event: Event }) {
  const { label, color } = getEventStatus(event.date);

  const badgeColor =
    color === "green"
      ? "bg-green-100 text-green-700"
      : color === "blue"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  return (
    <Card className="flex flex-col sm:flex-row items-start gap-4 p-4">
      <img
        src={event.image}
        alt={event.title}
        className="w-24 h-32 object-cover rounded-md"
      />
      <div className="flex-1">
        <CardHeader className="p-0">
          <CardTitle className="text-lg flex items-center gap-2">
            {event.title}
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${badgeColor}`}
            >
              {label}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
          <p className="text-sm mb-2">{event.location}</p>

          {event.registered ? (
            <Button variant="secondary" size="sm" disabled>
              Registered
            </Button>
          ) : (
            <Button size="sm">Register</Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
