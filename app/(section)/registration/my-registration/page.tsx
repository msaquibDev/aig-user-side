// app/(section)/registration/my-registration/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { useEventStore } from "@/app/store/useEventStore";
import RegistrationStepper from "@/components/registrations/myRegistration/RegistrationStepper";
import Step1BasicDetails from "@/components/registrations/myRegistration/Step1BasicDetails";
import Step4ConfirmPay from "@/components/registrations/myRegistration/Step4ConfirmPay";
import Loading from "@/components/common/Loading";
import ExistingRegistrationView from "@/components/registrations/myRegistration/ExistingRegistrationView";

function RegistrationContent() {
  const { currentStep, setStep, updateBasicDetails, resetForm } =
    useRegistrationStore();
  const { events, currentEvent, setCurrentEvent, fetchEvents } =
    useEventStore();
  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams.get("eventId");
  const registrationIdFromUrl = searchParams.get("registrationId");
  const fromBadge = searchParams.get("fromBadge") === "true";

  const [loading, setLoading] = useState(true);
  const [hasExistingRegistration, setHasExistingRegistration] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<any>(null);

  // Check for existing registration and initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // Fetch events if not loaded
        if (!events.length) {
          await fetchEvents();
        }

        // Fetch user profile
        const token = localStorage.getItem("accessToken");
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileRes.ok) {
          const user = await profileRes.json();
          updateBasicDetails({
            prefix: user.prefix ?? "",
            fullName: user.fullname || user.name || "",
            phone: user.mobile || user.phone || "",
            email: user.email || "",
            affiliation: user.affiliation ?? "",
            designation: user.designation ?? "",
            medicalCouncilState: user.medicalCouncilState ?? "",
            medicalCouncilRegistration: user.medicalCouncilRegistration ?? "",
            gender: user.gender ?? "male",
            country: user.country ?? "",
            city: user.city ?? "",
            state: user.state ?? "",
            pincode: user.pincode ?? "",
            mealPreference: user.mealPreference ?? "veg",
          });
        }

        // Set current event
        if (eventIdFromUrl && events.length) {
          const foundEvent = events.find((e) => e._id === eventIdFromUrl);
          if (foundEvent) {
            setCurrentEvent(foundEvent);
            updateBasicDetails({
              eventId: foundEvent._id,
              eventName: foundEvent.eventName,
            });

            // Check if user already has registration for this event
            const registrationCheckRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/event/${eventIdFromUrl}/my-registration`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (registrationCheckRes.ok) {
              const registrationData = await registrationCheckRes.json();
              if (registrationData.success && registrationData.data) {
                setHasExistingRegistration(true);
                setExistingRegistration(registrationData.data);

                // If coming from badge page or has existing registration, reset the form state
                if (fromBadge || registrationData.data) {
                  resetForm(); // Use resetForm instead of resetRegistration
                }
              }
            }
          }
        }

        // If registrationId is provided in URL, fetch that specific registration
        if (registrationIdFromUrl) {
          const registrationRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/${registrationIdFromUrl}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (registrationRes.ok) {
            const registrationData = await registrationRes.json();
            if (registrationData.success && registrationData.data) {
              setHasExistingRegistration(true);
              setExistingRegistration(registrationData.data);
              resetForm(); // Use resetForm instead of resetRegistration
            }
          }
        }
      } catch (error) {
        console.error("Error initializing registration:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [
    eventIdFromUrl,
    registrationIdFromUrl,
    fromBadge,
    events,
    fetchEvents,
    setCurrentEvent,
    updateBasicDetails,
    resetForm, // Use resetForm instead of resetRegistration
  ]);

  const goNext = () => setStep(Math.min(currentStep + 1, 2));
  const goBack = () => setStep(Math.max(currentStep - 1, 1));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loading />
      </div>
    );
  }

  // Show existing registration details if user already registered
  if (hasExistingRegistration && existingRegistration) {
    return (
      <ExistingRegistrationView
        registration={existingRegistration}
        eventId={eventIdFromUrl}
      />
    );
  }

  // Show registration form for new registration
  return (
    <main className="px-4 sm:px-6 pb-10 relative mt-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#00509E]">
            My Registration
          </h2>
          {currentEvent && (
            <p className="text-gray-600">
              Registering for: <strong>{currentEvent.eventName}</strong>
            </p>
          )}
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <RegistrationStepper currentStep={currentStep} />

          <div className="mt-10">
            {currentStep === 1 && <Step1BasicDetails onNext={goNext} />}
            {currentStep === 2 && <Step4ConfirmPay onBack={goBack} />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-64">
          <Loading />
        </div>
      }
    >
      <RegistrationContent />
    </Suspense>
  );
}
