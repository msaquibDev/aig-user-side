import { dummyAnnouncements, type Announcement } from "@/app/data/announcement";
import AnnouncementCard from "@/components/dashboard/Announcement";

export default function AnnouncementsPage() {
  const announcements = dummyAnnouncements();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">
        Announcements
      </h1>
      {announcements.map((announcement: Announcement) => (
        <AnnouncementCard key={announcement.id} data={announcement} />
      ))}
    </div>
  );
}
