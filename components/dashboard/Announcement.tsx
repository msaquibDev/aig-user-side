"use client";

import { Download, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Announcement } from "@/app/data/announcement";

export default function AnnouncementCard({ data }: { data: Announcement }) {
  // Dummy download function
  const handleDownload = (certName: string) => {
    const dummyContent = `This is your certificate for: ${certName}`;
    const blob = new Blob([dummyContent], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${certName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="text-sm text-gray-500 flex items-center gap-1 mb-2">
          <Calendar size={16} />
          {data.date}
        </div>
        <Download
          size={20}
          onClick={() => handleDownload(data.title)}
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
        />
      </div>

      <h3 className="text-base font-semibold mb-1">{data.title}</h3>
      <p className="text-sm text-gray-700 mb-3">{data.description}</p>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Avatar className="h-6 w-6">
          <AvatarFallback>{data.author[0]}</AvatarFallback>
        </Avatar>
        Posted by {data.author}
      </div>
    </Card>
  );
}
