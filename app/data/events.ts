// /data/events.ts
import { isToday, isBefore, parse } from "date-fns";

type EventStatus = "live" | "completed" | "upcoming";

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  department: string;
  registered: boolean;
  status?: EventStatus;
  eventDate?: Date;
};

export const events: Event[] = [
  {
    id: "1",
    title: "Gut, Liver & Lifelines",
    date: "1 Jun 2025",
    location: "Auditorium, AIG Hospitals",
    image: "/eventImg/event1.png",
    department: "Gastroenterology",
    registered: true,
  },
  {
    id: "2",
    title: "Tiny Guts, Uncommon Encounters",
    date: "31 May 2025",
    location: "Auditorium, AIG Hospitals",
    image: "/eventImg/event2.jpg",
    department: "Pediatrics",
    registered: true,
  },
  {
    id: "3",
    title: "AIG IBD Summit 2025",
    date: "29 Apr 2025 - 27 Apr 2025",
    location: "HICC Novotel, Hyderabad",
    image: "/eventImg/event3.png",
    department: "Nephrology",
    registered: false,
  },
  {
    id: "4",
    title: "Tiny Guts, Uncommon Encounters",
    date: "31 May 2025",
    location: "Auditorium, AIG Hospitals",
    image: "/eventImg/event4.jpg",
    department: "Cardiology",
    registered: true,
  },
  {
    id: "5",
    title: "AIG IBD Summit 2025",
    date: "29 Apr 2025 - 27 Apr 2025",
    location: "HICC Novotel, Hyderabad",
    image: "/eventImg/event5.jpg",
    department: "Orthopedics",
    registered: true,
  },
].map((event) => {
  const today = new Date();
  const rawDate = event.date.split("-")[0].trim();

  const eventDate = parse(rawDate, "d MMM yyyy", new Date());

  let status: EventStatus = "upcoming";
  if (isToday(eventDate)) status = "live";
  else if (isBefore(eventDate, today)) status = "completed";

  return {
    ...event,
    status,
    eventDate,
  };
});
