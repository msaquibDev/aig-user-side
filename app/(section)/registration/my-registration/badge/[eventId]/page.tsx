"use client";

import { Badge } from "@/components/registrations/myRegistration/Badge";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function BadgePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params); // ✅ unwrap params properly
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId");
  const [registration, setRegistration] = useState<any>(null);

  // useEffect(() => {
  //   if (!registrationId || !eventId) return;
  //     .then(setRegistration)
  //     .catch((e) => console.error("❌ Failed to fetch registration:", e));
  // }, [registrationId, eventId]);

  if (!registration)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium"></span>
      </div>
    );

  return <Badge registration={registration} />;
}
