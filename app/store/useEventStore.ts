// store/useEventStore.ts
import { create } from "zustand";
import axios from "axios";

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
}

export interface Event {
  _id: string;
  eventName: string;
  shortName: string;
  eventImage: string;
  eventCode: string;
  regNumber?: string;
  organizer: Organizer;
  department: Department;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  venueName: Venue;
  country: string;
  state: string;
  city: string;
  eventType: string;
  registrationType: string;
  currencyType: string;
  eventCategory: string; // Conference | CME | Workshop
  isEventApp: boolean;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  currentEvent: null,
  loading: false,
  error: null,

  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("https://admin.aigevent.tech/api/events"); // ✅ external API
      set({ events: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  setCurrentEvent: (event) => set({ currentEvent: event }),
}));
