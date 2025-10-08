// store/useAnnouncementStore.ts
import { create } from "zustand";

export interface Announcement {
  _id: string;
  updatedAt: string;
  heading: string;
  description: string;
  postedBy: string;
  downloadUrl?: string;
  createdAt?: string;
}

interface AnnouncementState {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  fetchAnnouncements: () => Promise<void>;
  clearError: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  announcements: [],
  loading: false,
  error: null,

  fetchAnnouncements: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/announcements`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Failed to fetch announcements: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        set({ announcements: data.data, loading: false });
      } else {
        throw new Error("Invalid response format from announcements API");
      }
    } catch (err: any) {
      console.error("Error fetching announcements:", err);
      set({
        error: err.message || "Failed to fetch announcements",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
