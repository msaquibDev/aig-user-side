"use client";

import { QRCodeSVG } from "qrcode.react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { formatEventDate } from "@/app/utils/formatEventDate";

interface BadgeProps {
  registration: any;
}

export function Badge({ registration }: BadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleDownloadBadge = async () => {
    if (!badgeRef.current) return;

    try {
      const imgData = await toPng(badgeRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width: badgeRef.current.scrollWidth,
        height: badgeRef.current.scrollHeight,
        style: {
          margin: "0 auto",
        },
      });
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `badge-${registration.regNum || registration._id}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading badge:", error);
    }
  };

  const handleShareBadge = async () => {
    if (!badgeRef.current) return;

    try {
      setIsSharing(true);
      const imgData = await toPng(badgeRef.current, {
        quality: 0.8,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: badgeRef.current.scrollWidth,
        height: badgeRef.current.scrollHeight,
        style: {
          margin: "0 auto",
        },
      });

      if (!imgData) return;

      const blob = await (await fetch(imgData)).blob();
      const file = new File(
        [blob],
        `badge-${registration.regNum || registration._id}.png`,
        {
          type: "image/png",
        }
      );

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Badge for ${registration.name}`,
          text: `Here is my badge for ${
            registration.eventId?.title || "the event"
          }`,
          files: [file],
        });
      } else {
        // Fallback: Copy to clipboard or show download
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing badge:", err);
      // Fallback download
      handleDownloadBadge();
    } finally {
      setIsSharing(false);
    }
  };

  // Get event data from populated registration or use fallbacks
  const eventName =
    registration.eventId?.eventName ||
    registration.eventId?.title ||
    registration.eventName ||
    "Event";

  // Get registration details - handle both backend response structures
  const attendeeName = registration.name || "Attendee";
  const prefix = registration.prefix || "";
  const regNum = registration.regNum || `REG-${registration._id?.slice(-6)}`;
  const registrationCategory =
    registration.registrationSlabId?.slabName ||
    registration.registrationCategory ||
    "Attendee";

  // QR Code value - include essential registration info
  const qrValue = JSON.stringify({
    regNum: regNum,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-4">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00509E] mb-2">
            Your Event Badge
          </h1>
          <p className="text-gray-600">
            Show this badge at the event venue for entry
          </p>
        </div>

        {/* Badge Card */}
        <div
          ref={badgeRef}
          className="w-[400px] bg-white border-1 rounded-lg border-gray-300 mx-auto"
        >
          <CardContent className="flex flex-col items-center p-8">
            {/* Profile Section */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {prefix} {attendeeName}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Reg No: <span className="font-mono font-semibold">{regNum}</span>
            </p>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm mb-6">
              <QRCodeSVG
                value={qrValue}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Event Info */}
            <div className="text-center mb-4 w-full">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {eventName}
              </h3>
              <p className="text-sm text-gray-600">
                {/* {registration.eventId?.startDate} {"-"}{" "}
                {registration.eventId?.endDate || "Event Date"} */}
                {formatEventDate(
                  registration.eventId?.startDate,
                  registration.eventId?.endDate
                )}
              </p>
            </div>

            {/* Category Footer */}
            <div className="w-full">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold text-center py-3 rounded-xl shadow-lg">
                {registrationCategory.toUpperCase()}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 text-xs text-gray-500 text-center w-full">
              <p>Scan QR code for verification</p>
              <p className="mt-1">Valid for event entry only</p>
            </div>
          </CardContent>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <Button
            onClick={handleDownloadBadge}
            variant="default"
            className="flex items-center gap-2 bg-[#00509E] hover:bg-[#003B73] px-6 py-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Badge
          </Button>

          <Button
            onClick={handleShareBadge}
            variant="outline"
            disabled={isSharing}
            className="flex items-center gap-2 border-[#00509E] text-[#00509E] hover:bg-[#00509E] hover:text-white px-6 py-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>• Save or screenshot this badge for offline access</p>
          <p>• Present at event registration desk</p>
          <p>• Keep your registration number handy</p>
        </div>
      </div>
    </div>
  );
}
