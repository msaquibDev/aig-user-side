"use client";

import { QRCodeSVG } from "qrcode.react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";

interface BadgeProps {
  registration: any;
}

export function Badge({ registration }: BadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleDownloadBadge = async () => {
    const imgData = await toPng(badgeRef.current!);
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `badge-${registration.regNum}.png`;
    link.click();
  };

  const handleShareBadge = async () => {
    if (!badgeRef.current) return;
    try {
      setIsSharing(true);
      const imgData = await toPng(badgeRef.current!);
      if (!imgData) return;
      const blob = await (await fetch(imgData)).blob();
      const file = new File([blob], `badge-${registration.regNum}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Badge for ${registration.fullName}`,
          text: `Here is my badge for the event`,
          files: [file],
        });
      } else {
        alert("Sharing is not supported on this device.");
      }
    } catch (err) {
      console.error("❌ Error sharing badge:", err);
    } finally {
      setIsSharing(false);
    }
  };

  // QR Code value
  const qrValue = JSON.stringify({
    name: registration.fullName,
    regNum: registration.regNum,
    eventName: registration.eventName,
    eventCode: registration.eventCode,
  });

  return (
    <div className="flex flex-col items-center mt-10">
      <div
        ref={badgeRef}
        className="w-[320px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Event Banner */}
        <img src={registration.eventImage || "/eventImg/event1.png"} alt={registration.eventName || "Event Image"} className="w-full h-50 object-cover" />

        <CardContent className="flex flex-col items-center p-6">
          {/* QR Code */}
          <div className="bg-white p-3 rounded-lg shadow mb-4">
            <QRCodeSVG value={qrValue} size={128} />
          </div>

          {/* Name + Reg Number */}
          <p className="text-lg font-semibold text-center">
            {registration.prefix} {registration.fullName}
          </p>
          <p className="text-sm italic text-gray-600 mb-4 text-center">
            Reg No. {registration.regNum}
          </p>

          {/* Category Footer */}
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold text-center py-2 rounded-lg w-full">
            {registration.registrationCategory?.toUpperCase()}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleDownloadBadge}
              variant="default"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download
            </Button>
            <Button
              onClick={handleShareBadge}
              variant="outline"
              disabled={isSharing}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              {isSharing ? "Sharing..." : "Share"}
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
