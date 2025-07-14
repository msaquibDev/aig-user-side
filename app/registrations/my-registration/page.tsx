"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import RegistrationStepper from "@/app/components/registrations/RegistrationStepper";
import Step1BasicDetails from "@/app/components/registrations/Step1BasicDetails";
import Step2AccompanyingPerson from "@/app/components/registrations/Step2AccompanyingPerson";
import Step3SelectWorkshop from "@/app/components/registrations/Step3SelectWorkshop";
import Step4ConfirmPay from "@/app/components/registrations/Step4ConfirmPay";

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
