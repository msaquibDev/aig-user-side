"use client";

import QRCode from "react-qr-code";

export default function BadgeCard({
  name,
  regNo,
  role,
  qrData,
}: {
  name: string;
  regNo: string;
  role: string;
  qrData: string;
}) {
  return (
    <div className="w-[300px] rounded-xl shadow-xl border overflow-hidden bg-white print:border-none print:shadow-none print:w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FBB040] to-[#F7941D] h-6 w-full" />

      {/* Banner Image */}
      <div className="bg-white border-b">
        <img
          src="/eventImg/event1.png"
          alt="AIG IB Summit 2025"
          className="w-full h-40 object-cover"
        />
      </div>

      {/* QR Code & Details */}
      <div className="flex flex-col items-center justify-center py-6 px-4 space-y-4">
        <div className="bg-white p-2 rounded shadow">
          <QRCode value={qrData} size={128} />
        </div>

        <div className="text-center">
          <p className="font-semibold text-lg uppercase text-gray-800">
            {name}
          </p>
          <p className="italic text-sm mt-1 text-gray-600">REG NO. {regNo}</p>
        </div>
      </div>

      {/* Footer Role */}
      <div className="bg-gradient-to-r from-[#FBB040] to-[#F7941D] text-center py-3">
        <span className="font-bold uppercase text-black text-sm tracking-wider">
          {role}
        </span>
      </div>
    </div>
  );
}
