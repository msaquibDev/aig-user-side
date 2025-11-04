// app/(section)/registration/my-registration/badge/[eventId]/page.tsx
"use client";

import { Badge } from "@/components/registrations/myRegistration/Badge";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEventStore } from "@/app/store/useEventStore";

export default function BadgePage({ params }: { params: { eventId: string } }) {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId");
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentEvent } = useEventStore();

  // Fetch event data when component mounts
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentEvent(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [params.eventId, setCurrentEvent]);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      if (!registrationId) {
        toast.error("Registration ID is required");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/${registrationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch registration");
        }

        const data = await res.json();
        console.log("Fetched registration:", data);

        if (data.success && data.data) {
          setRegistration(data.data);
        } else {
          toast.error("Registration not found");
        }
      } catch (error) {
        console.error("Error fetching registration:", error);
        toast.error("Failed to load registration details");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [registrationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium">
          Loading badge details...
        </span>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">Registration not found.</p>
        <button
          onClick={() => (window.location.href = "/dashboard/events")}
          className="bg-[#00509E] text-white px-6 py-2 rounded hover:bg-[#003B73]"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return <Badge registration={registration} />;
}
