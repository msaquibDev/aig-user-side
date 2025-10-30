// app/(section)/registration/my-registration/workshop/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import WorkshopFormSidebar from "@/components/registrations/workshop/WorkshopFormSidebar";
import WorkshopTable from "@/components/registrations/workshop/WorkshopTable";
import Loading from "@/components/common/Loading";

function WorkshopContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const registrationId = searchParams.get("registrationId");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRegistration, setHasRegistration] = useState(false);
  const [eventName, setEventName] = useState("");

  // Check if user has registration and get event details
  useEffect(() => {
    const checkRegistration = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Check if user has registration for this event
        const token = localStorage.getItem("accessToken");
        const registrationCheckRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/event/${eventId}/my-registration`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (registrationCheckRes.ok) {
          const registrationData = await registrationCheckRes.json();
          if (registrationData.success && registrationData.data) {
            setHasRegistration(true);
            setEventName(
              registrationData.data.eventId?.eventName || "this event"
            );
          }
        }

        // If registrationId is provided, we already know user has registration
        if (registrationId) {
          setHasRegistration(true);

          // Fetch registration details to get event name
          const registrationRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/${registrationId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (registrationRes.ok) {
            const regData = await registrationRes.json();
            if (regData.success && regData.data) {
              setEventName(regData.data.eventId?.eventName || "this event");
            }
          }
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, [eventId, registrationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with context info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#00509E] mb-2">
          Workshop Registration
        </h1>

        {hasRegistration && eventName && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">
              You are managing workshops for your registration to{" "}
              <strong>{eventName}</strong>
            </p>
            {registrationId && (
              <p className="text-blue-600 text-sm mt-1">
                Registration ID: {registrationId}
              </p>
            )}
          </div>
        )}

        {/* ✅ CHANGED: Allow workshop registration even without main registration */}
        {!hasRegistration && eventId && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">
              You can register for workshops directly. You can complete your
              main event registration later.
            </p>
          </div>
        )}

        {!eventId && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              Please select an event to register for workshops.
            </p>
          </div>
        )}
      </div>

      <WorkshopTable
        eventId={eventId}
        registrationId={registrationId}
        onAddClick={() => {
          setEditId(null);
          setOpen(true);
        }}
        onEditClick={(id) => {
          setEditId(id);
          setOpen(true);
        }}
      />

      <WorkshopFormSidebar
        eventId={eventId}
        registrationId={registrationId}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
        editId={editId}
      />
    </div>
  );
}

export default function WorkshopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-64">
          <Loading />
        </div>
      }
    >
      <WorkshopContent />
    </Suspense>
  );
}
