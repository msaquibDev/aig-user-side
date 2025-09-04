"use client";

import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface BadgeProps {
  registration: any;
  event: any;
}

export function Badge({ registration, event }: BadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const generateBadgeImage = async () => {
    if (!badgeRef.current) return null;
    const canvas = await html2canvas(badgeRef.current, {
      scale: 2,
      useCORS: true,
    });
    return canvas.toDataURL("image/png");
  };

  const handleDownloadPDF = async () => {
    try {
      const imgData = await generateBadgeImage();
      if (!imgData) return;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const ratio = pageWidth / imgProps.width;
      const imgHeight = imgProps.height * ratio;

      pdf.addImage(imgData, "PNG", 0, 40, pageWidth, imgHeight);
      pdf.save(`badge-${registration._id}.pdf`);
    } catch (error) {
      console.error("❌ Failed to generate PDF:", error);
    }
  };

  const handleShareBadge = async () => {
    try {
      setIsSharing(true);
      const imgData = await generateBadgeImage();
      if (!imgData) return;

      const blob = await (await fetch(imgData)).blob();
      const file = new File([blob], `badge-${registration._id}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${event.name} Badge`,
          text: `Here is my badge for ${event.name}`,
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

  const qrValue = JSON.stringify({
    regId: registration._id,
    name: registration.basicDetails.fullName,
    eventId: event._id,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={badgeRef} className="w-full max-w-sm">
        <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white">
          <CardContent className="flex flex-col items-center p-6">
            {/* Event Name */}
            <h2 className="text-xl font-bold text-center mb-2">{event.name}</h2>

            {/* User Name */}
            <p className="text-lg font-semibold">
              {registration.basicDetails.fullName}
            </p>

            {/* Category */}
            <p className="text-sm text-gray-600 mb-4">
              {registration.registrationCategory?.name ?? "Category"}
            </p>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-lg shadow-inner mb-4">
              <QRCodeSVG value={qrValue} size={128} />
            </div>

            {/* Event Dates */}
            <p className="text-xs text-gray-500">
              {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </p>

            {/* Location */}
            <p className="text-xs text-gray-500">{event.location}</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownloadPDF}
          variant="default"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>

        <Button
          onClick={handleShareBadge}
          variant="outline"
          disabled={isSharing}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? "Sharing..." : "Share"}
        </Button>
      </div>
    </div>
  );
}
