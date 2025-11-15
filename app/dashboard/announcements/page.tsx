// app/dashboard/announcements/page.tsx (Using Store)
"use client";

import { useEffect } from "react";
import AnnouncementCard from "@/components/dashboard/Announcement";
import { useAnnouncementStore } from "@/app/store/useAnnouncementStore";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/common/Loading";

export default function AnnouncementsPage() {
  const { announcements, loading, error, fetchAnnouncements, clearError } =
    useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleRetry = () => {
    clearError();
    fetchAnnouncements();
  };

  return (
    <div className="p-4 md:p-6 max-w-10xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00509E] mb-2">
          Announcements
        </h1>
        <p className="text-gray-600">
          Stay updated with the latest news and updates
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          {/* <Loader2 className="w-8 h-8 animate-spin text-[#00509E] mb-4" /> */}
          <Loading />
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 font-medium mb-3">{error}</p>
            <Button
              onClick={handleRetry}
              className="bg-[#00509E] hover:bg-[#003B73] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-500 text-lg mb-2">No announcements found</p>
            <p className="text-gray-400 text-sm">
              There are no announcements at the moment. Please check back later.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement._id} data={announcement} />
          ))}
        </div>
      )}
    </div>
  );
}
