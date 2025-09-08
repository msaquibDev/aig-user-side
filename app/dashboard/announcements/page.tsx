// app/dashboard/announcements/page.tsx
import AnnouncementCard from "@/components/dashboard/Announcement";

export type Announcement = {
  _id: string;
  updatedAt: string;
  heading: string;
  description: string;
  postedBy: string;
  downloadUrl: string;
};

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch("https://admin.aigevent.tech/api/announcements", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // SSR cache settings
      cache: "no-store", // so it always fetches fresh data
    });

    const json = await res.json();
    // console.log("SSR Announcements JSON:", json);

    if (json.success && Array.isArray(json.data)) {
      return json.data;
    } else if (Array.isArray(json)) {
      return json;
    } else if (json.announcements) {
      return json.announcements;
    }
    return [];
  } catch (error) {
    console.error("Error fetching announcements (server):", error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  if (!announcements || announcements.length === 0) {
    return <p className="p-4 text-red-500">No announcements found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">
        Announcements
      </h1>
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement._id} data={announcement} />
      ))}
    </div>
  );
}
