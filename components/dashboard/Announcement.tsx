"use client";

import { Download, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
// import { Announcement } from "@/app/data/announcement";
import { jsPDF } from "jspdf";
import { Announcement } from "@/app/dashboard/announcements/page";

export default function AnnouncementCard({ data }: { data: Announcement }) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    return formattedDate.replace(",", " at") + " (IST)";
  };

  // Dummy download function
  const handleDownload = () => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Event Announcement", 105, 15, { align: "center" });

    // Safely render title
    const title = data?.heading ?? "Untitled Announcement";
    doc.setFontSize(14);
    doc.text(String(title), 10, 30);

    // Date & Author
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${formatDate(data.updatedAt)} `, 10, 40);
    doc.text(`Author: ${data.postedBy ?? "Unknown"}`, 10, 47);

    // Description (multi-line)
    doc.setFontSize(12);
    doc.text("Description:", 10, 60);
    doc.setFontSize(11);
    const description = data?.description ?? "No description provided.";
    const splitText = doc.splitTextToSize(String(description), 180);
    doc.text(splitText, 10, 68);

    // Save PDF
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <Card className="p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="text-sm text-gray-500 flex items-center gap-1 mb-2">
          <Calendar size={16} />
          {formatDate(data.updatedAt)}
        </div>
        <Download
          size={20}
          onClick={handleDownload}
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
        />
      </div>

      <h3 className="text-base font-semibold mb-1">{data.heading}</h3>
      <p className="text-sm text-gray-700 mb-3">{data.description}</p>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Avatar className="h-6 w-6">
          <AvatarFallback>
            {data.postedBy ? data.postedBy[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        Posted by {data.postedBy}
      </div>
    </Card>
  );
}
