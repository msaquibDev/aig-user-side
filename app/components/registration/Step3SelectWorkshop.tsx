"use client";

import { useState, useEffect } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Dummy workshops list – replace with dynamic list if needed
const workshops = [
  { id: "ws1", title: "Advanced Cardiology" },
  { id: "ws2", title: "Emergency Medicine" },
  { id: "ws3", title: "Pediatrics Updates" },
];

export default function Step3SelectWorkshop({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { selectedWorkshops, setSelectedWorkshops } = useRegistrationStore();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(selectedWorkshops);
  }, [selectedWorkshops]);

  const toggleWorkshop = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one workshop.");
      return;
    }

    setSelectedWorkshops(selected);
    toast.success("Workshops saved!");
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#003B73]">Select Workshops</h2>

      <div className="grid gap-4">
        {workshops.map((ws) => (
          <label key={ws.id} className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              id={ws.id}
              checked={selected.includes(ws.id)}
              onCheckedChange={() => toggleWorkshop(ws.id)}
            />
            <span className="text-sm">{ws.title}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#00509E] text-white hover:bg-[#003B73]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
