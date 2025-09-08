"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import RegistrationStepper from "@/components/registrations/myRegistration/RegistrationStepper";
import Step1BasicDetails from "@/components/registrations/myRegistration/Step1BasicDetails";
import Step2AccompanyingPerson from "@/components/registrations/myRegistration/Step2AccompanyingPerson";
import Step3SelectWorkshop from "@/components/registrations/myRegistration/Step3SelectWorkshop";
import Step4ConfirmPay from "@/components/registrations/myRegistration/Step4ConfirmPay";
import { useEventStore } from "@/app/store/useEventStore";
import Loading from "@/components/common/Loading";

export default function RegistrationPage() {
  const { currentStep, setStep, updateBasicDetails } = useRegistrationStore();
  const { events, currentEvent, setCurrentEvent, fetchEvents } =
    useEventStore();

  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams.get("eventId");
  console.log("Event ID from URL:", eventIdFromUrl);
  console.log("search params", searchParams.get("eventId"));

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const user = await res.json(); // user document is returned directly
        console.log("Fetched user profile:", user);

        if (user) {
          updateBasicDetails({
            prefix: user.prefix ?? "",
            fullName: user.fullname ?? "",
            phone: user.mobile ?? "",
            email: user.email ?? "",
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
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, [updateBasicDetails]);

  useEffect(() => {
    if (!events.length) fetchEvents();
  }, [events, fetchEvents]);

  // ✅ Set current event based on URL
  useEffect(() => {
    if (!eventIdFromUrl || !events.length) return;

    const foundEvent = events.find((e) => e._id === eventIdFromUrl);
    if (foundEvent) {
      setCurrentEvent(foundEvent);
      updateBasicDetails({
        eventId: foundEvent._id,
        eventName: foundEvent.eventName,
      });
    }
  }, [events, eventIdFromUrl, setCurrentEvent, updateBasicDetails]);

  // const goNext = () => setStep(Math.min(currentStep + 1, 4));

  const goNext = () => setStep(Math.min(currentStep + 1, 2));
  const goBack = () => setStep(Math.max(currentStep - 1, 1));

  return (
    <Suspense fallback={<Loading />}>
      <main className="px-4 sm:px-6 pb-10 relative mt-6">
        {/* Heading + optional action (if needed in future) */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#00509E]">
            My Registration
          </h2>
          {/* 
        Optional Add Button here (if you want to allow adding outside the stepper flow)
        <Button className="bg-[#00509E] hover:bg-[#003B73]">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add
        </Button>
      */}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          {/* Stepper */}
          <RegistrationStepper currentStep={currentStep} />

          {/* Step Content */}
          <div className="mt-10">
            {currentStep === 1 && <Step1BasicDetails onNext={goNext} />}
            {/* {currentStep === 2 && (
            <Step2AccompanyingPerson onNext={goNext} onBack={goBack} />
          )}
          {currentStep === 3 && (
            <Step3SelectWorkshop onNext={goNext} onBack={goBack} />
          )} */}
            {currentStep === 2 && <Step4ConfirmPay onBack={goBack} />}
          </div>
        </div>
      </main>
    </Suspense>
  );
}
