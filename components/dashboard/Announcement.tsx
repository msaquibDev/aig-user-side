"use client";

import { Download, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Announcement } from "@/app/data/announcement";

export default function AnnouncementCard({ data }: { data: Announcement }) {
  return (
    <Card className="p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="text-sm text-gray-500 flex items-center gap-1 mb-2">
          <Calendar size={16} />
          {data.date}
        </div>
        <a href={data.downloadUrl} target="_blank" rel="noreferrer">
          <Download size={20} className="text-blue-600 hover:text-blue-800" />
        </a>
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
