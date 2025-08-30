"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import RegistrationStepper from "@/components/registrations/myRegistration/RegistrationStepper";
import Step1BasicDetails from "@/components/registrations/myRegistration/Step1BasicDetails";
import Step2AccompanyingPerson from "@/components/registrations/myRegistration/Step2AccompanyingPerson";
import Step3SelectWorkshop from "@/components/registrations/myRegistration/Step3SelectWorkshop";
import Step4ConfirmPay from "@/components/registrations/myRegistration/Step4ConfirmPay";
import { useEventStore } from "@/app/store/useEventStore";

export default function RegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { setCurrentEvent } = useEventStore();
  const { currentStep, setStep, updateBasicDetails } = useRegistrationStore();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("/api/user/registration", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const result = await res.json();
        const user = result?.data?.user;
        console.log("Fetched user details:", user);
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
      } catch (error) {
        // toast.error("Error loading profile");
        console.error(error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      try {
        if (!eventId) return;

        const res = await fetch(`/api/events/${eventId}`, {
          cache: "no-store",
        });
        const result = await res.json();

        console.log("Event API response:", result);

        if (!res.ok || !result?.success)
          throw new Error("Failed to fetch event");

        // result.data is an array of categories
        setCurrentEvent(result.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setCurrentEvent(null);
      }
    }

    fetchEvent();
  }, [eventId, setCurrentEvent]);

  // const goNext = () => setStep(Math.min(currentStep + 1, 4));
  const goNext = () => setStep(Math.min(currentStep + 1, 2));
  const goBack = () => setStep(Math.max(currentStep - 1, 1));

  return (
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
  );
}
