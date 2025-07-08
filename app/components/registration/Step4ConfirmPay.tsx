"use client";

import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const workshopMap: Record<string, string> = {
  ws1: "Advanced Cardiology",
  ws2: "Emergency Medicine",
  ws3: "Pediatrics Updates",
};

export default function Step4ConfirmPay({ onBack }: { onBack: () => void }) {
  const { basicDetails, accompanyingPerson, selectedWorkshops } =
    useRegistrationStore();

  const isValid = () => {
    return (
      basicDetails.fullName.trim() &&
      basicDetails.email.trim() &&
      basicDetails.phone.trim() &&
      selectedWorkshops.length > 0
    );
  };

  const handleSubmit = () => {
    if (!isValid()) {
      toast.error("Please complete all required details before submitting.");
      return;
    }

    // Final submission (you can replace this with actual API call)
    console.log("Submitted:", {
      basicDetails,
      accompanyingPerson,
      selectedWorkshops,
    });

    toast.success("Registration submitted successfully!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#003B73]">Review & Confirm</h2>

      <div className="border rounded p-4 space-y-2 text-sm bg-gray-50">
        <div>
          <strong>Name:</strong> {basicDetails.fullName}
        </div>
        <div>
          <strong>Email:</strong> {basicDetails.email}
        </div>
        <div>
          <strong>Phone:</strong> {basicDetails.phone}
        </div>
        <div>
          <strong>Age:</strong> {basicDetails.age}
        </div>
        <div>
          <strong>Gender:</strong> {basicDetails.gender}
        </div>
        <div>
          <strong>Designation:</strong> {basicDetails.designation}
        </div>

        {accompanyingPerson?.name && (
          <>
            <div className="pt-2 font-medium text-[#00509E]">
              Accompanying Person:
            </div>
            <div>
              <strong>Name:</strong> {accompanyingPerson.name}
            </div>
            <div>
              <strong>Age:</strong> {accompanyingPerson.age}
            </div>
            <div>
              <strong>Gender:</strong> {accompanyingPerson.gender}
            </div>
          </>
        )}

        {selectedWorkshops.length > 0 && (
          <>
            <div className="pt-2 font-medium text-[#00509E]">Workshops:</div>
            <ul className="list-disc list-inside">
              {selectedWorkshops.map((id: string) => (
                <li key={id}>{workshopMap[id] || id}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Confirm & Pay
        </Button>
      </div>
    </div>
  );
}
