"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import RegistrationStepper from "@/components/registrations/myRegistration/RegistrationStepper";
import Step1BasicDetails from "@/components/registrations/myRegistration/Step1BasicDetails";
import Step2AccompanyingPerson from "@/components/registrations/myRegistration/Step2AccompanyingPerson";
import Step3SelectWorkshop from "@/components/registrations/myRegistration/Step3SelectWorkshop";
import Step4ConfirmPay from "@/components/registrations/myRegistration/Step4ConfirmPay";


export default function RegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { currentStep, setStep } = useRegistrationStore();

  useEffect(() => {
    setStep(1);
  }, [eventId]);

  const goNext = () => setStep(Math.min(currentStep + 1, 4));
  const goBack = () => setStep(Math.max(currentStep - 1, 1));

  return (
    <main className="px-4 sm:px-6 pb-10 relative mt-6">
      {/* Heading + optional action (if needed in future) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#00509E]">
          Accompanying Persons
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
          {currentStep === 2 && (
            <Step2AccompanyingPerson onNext={goNext} onBack={goBack} />
          )}
          {currentStep === 3 && (
            <Step3SelectWorkshop onNext={goNext} onBack={goBack} />
          )}
          {currentStep === 4 && <Step4ConfirmPay onBack={goBack} />}
        </div>
      </div>
    </main>
  );
}
