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

function RegistrationContent() {
  const { currentStep, setStep, updateBasicDetails } = useRegistrationStore();
  const { events, currentEvent, setCurrentEvent, fetchEvents } =
    useEventStore();
  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams.get("eventId");
  const [loading, setLoading] = useState(true);

  // Fetch user profile and event data
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
    events,
    fetchEvents,
    setCurrentEvent,
    updateBasicDetails,
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
