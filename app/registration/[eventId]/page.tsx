"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import RegistrationStepper from "@/app/components/registration/RegistrationStepper";
import Step1BasicDetails from "@/app/components/registration/Step1BasicDetails";
import Step2AccompanyingPerson from "@/app/components/registration/Step2AccompanyingPerson";
import Step3SelectWorkshop from "@/app/components/registration/Step3SelectWorkshop";
import Step4ConfirmPay from "@/app/components/registration/Step4ConfirmPay";

export default function RegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { currentStep, setStep } = useRegistrationStore();

  useEffect(() => {
    setStep(1);
  }, [eventId]);

  const goNext = () => setStep(Math.min(currentStep + 1, 4));
  const goBack = () => setStep(Math.max(currentStep - 1, 1));

  return (
    <div className="px-4 md:px-10 lg:px-20 py-10 max-w-5xl mx-auto">
      {/* ✅ Add Stepper here */}
      <RegistrationStepper currentStep={currentStep} />

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
  );
}
