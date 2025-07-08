"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { id: 1, title: "Fill Basic Details" },
  { id: 2, title: "Add Accompanying Person" },
  { id: 3, title: "Select Workshop" },
  { id: 4, title: "Confirm & Pay" },
];

export default function RegistrationStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="flex justify-between items-center px-4 sm:px-8">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div
            key={step.id}
            className="flex-1 flex flex-col items-center relative"
          >
            {/* Circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center z-10 text-sm font-semibold",
                isCompleted
                  ? "bg-[#00509E] text-white"
                  : isActive
                  ? "bg-[#003B73] text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step.id}
            </div>

            {/* Title */}
            <div
              className={cn(
                "mt-2 text-center text-xs font-medium",
                isActive
                  ? "text-[#003B73]"
                  : isCompleted
                  ? "text-gray-700"
                  : "text-gray-400"
              )}
            >
              {step.title}
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-4 right-[-50%] w-full h-0.5 bg-gray-300 z-0">
                <div
                  className={cn(
                    "h-full transition-all",
                    currentStep > step.id
                      ? "bg-[#00509E] w-full"
                      : "bg-gray-300 w-full"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
