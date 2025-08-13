"use client";

import { useState, useEffect } from "react";
import AnnouncementCard from "@/components/dashboard/Announcement";

export type Announcement = {
  _id: string;
  updatedAt: string;
  title: string;
  description: string;
  author: string;
  downloadUrl: string;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/user/announcements", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        // console.log("Response:", res);
        const json = await res.json();

        if (json.success) {
          setAnnouncements(json.data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium">
          Loading announcements...
        </span>
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return <p className="p-4 text-red-500">No announcements found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">
        Announcements
      </h1>

      {/* {loading && <p>Loading announcements...</p>} */}

      {/* {!loading && announcements.length === 0 && (
        <p className="text-gray-500">No announcements available</p>
      )} */}

      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement._id} data={announcement} />
      ))}
    </div>
  );
}
