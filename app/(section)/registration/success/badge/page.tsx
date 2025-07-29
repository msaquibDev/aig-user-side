"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import BadgeCard from "@/components/registrations/myRegistration/BadgeCard";

// Generate a dummy registration number
function getDummyRegNo() {
  return "AIG2025-" + Math.floor(100000 + Math.random() * 900000);
}

export default function BadgePage() {
  const { basicDetails } = useRegistrationStore();
  const router = useRouter();

  // Generate once per render (for demo, not persistent)
  const dummyRegNo = getDummyRegNo();

  useEffect(() => {
    // Protect page from direct access without valid data
    if (!basicDetails.fullName) {
      router.push("/registration/my-registration");
    }
  }, [basicDetails.fullName, router]);

  // Prepare QR data as JSON string
  const qrData = JSON.stringify({
    name: basicDetails.fullName,
    regNo: dummyRegNo,
    role: basicDetails.registrationCategory || "Attendee",
    email: basicDetails.email,
    phone: basicDetails.phone,
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <BadgeCard
        name={basicDetails.fullName}
        regNo={dummyRegNo}
        role={basicDetails.registrationCategory || "Attendee"}
        qrData={qrData}
      />
    </div>
  );
}
