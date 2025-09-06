"use client";

import { QRCodeSVG } from "qrcode.react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface BadgeProps {
  registration: any;
}

export function Badge({ registration }: BadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const generateBadgeImage = async () => {
    if (!badgeRef.current) return null;

    // wait a tick to ensure DOM is painted
    await new Promise((res) => setTimeout(res, 100));

    const canvas = await html2canvas(badgeRef.current, {
      scale: 2,
      useCORS: true,
    });
    return canvas.toDataURL("image/png");
  };

  const handleDownloadPDF = async () => {
    const imgData = await generateBadgeImage();
    if (!imgData) return;

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const imgProps = pdf.getImageProperties(imgData);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = pageWidth / imgProps.width;
    const imgHeight = imgProps.height * ratio;

    pdf.addImage(imgData, "PNG", 0, 40, pageWidth, imgHeight);
    pdf.save(`badge-${registration.regNum}.pdf`);
  };

  const handleShareBadge = async () => {
    try {
      setIsSharing(true);
      const imgData = await generateBadgeImage();
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
              onClick={handleDownloadPDF}
              variant="default"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download
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
        </CardContent>
      </div>
    </div>
  );
}
