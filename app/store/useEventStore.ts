// store/useEventStore.ts
import { create } from "zustand";

interface Organizer {
  _id: string;
  organizerName: string;
  contactPersonName: string;
  contactPersonMobile: string;
  contactPersonEmail: string;
  status: string;
}

interface Department {
  _id: string;
  departmentName: string;
  contactPersonName: string;
  contactPersonMobile: string;
  contactPersonEmail: string;
  status: string;
}

interface Venue {
  _id: string;
  venueName: string;
  venueAddress: string;
  venueImage: string;
  country: string;
  state: string;
  city: string;
  website: string;
  googleMapLink: string;
  distanceFromAirport: string;
  distanceFromRailwayStation: string;
  nearestMetroStation: string;
}

export interface Event {
  _id: string;
  eventName: string;
  shortName: string;
  eventImage: string;
  eventCode: string;
  regNum: string;
  organizer: Organizer;
  department: Department;
  startDate: string; // Format: "28/10/2025"
  endDate: string; // Format: "28/10/2025"
  startTime: string; // Format: "09:00 AM"
  endTime: string; // Format: "06:00 AM"
  timeZone: string;
  venueName: Venue;
  country: string;
  state: string;
  city: string;
  eventType: string;
  registrationType: "free" | "paid";
  currencyType?: string;
  eventCategory: string; // Conference | Workshop | CME
  isEventApp: boolean;
  dynamicStatus: "Live" | "Past" | "Upcoming";
  createdAt: string;
  updatedAt: string;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
  getEventById: (id: string) => Event | undefined;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  loading: false,
  error: null,

  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        set({ events: data.data, loading: false });
      } else {
        throw new Error("Invalid response format from events API");
      }
    } catch (err: any) {
      console.error("Error fetching events:", err);
      set({
        error: err.message || "Failed to fetch events",
        loading: false,
      });
    }
  },

  setCurrentEvent: (event) => set({ currentEvent: event }),

  getEventById: (id: string) => {
    const { events } = get();
    return events.find((event) => event._id === id);
  },
}));
