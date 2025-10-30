// components/registrations/workshop/WorkshopFormSidebar.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWorkshopStore } from "@/app/store/useWorkshopStore";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type Props = {
  eventId?: string | null;
  registrationId?: string | null;
  open: boolean;
  onClose: () => void;
  editId?: number | null;
};

export default function WorkshopFormSidebar({
  eventId,
  registrationId,
  open,
  onClose,
  editId,
}: Props) {
  const { groupedWorkshops, selectedWorkshops, selectWorkshop } =
    useWorkshopStore();
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (group: string, workshopId: number | null) => {
    selectWorkshop(group, workshopId);
  };

  const totalPrice = Object.values(selectedWorkshops).reduce(
    (sum: number, id: number | null) => {
      if (id === null) return sum;
      const allWorkshops = Object.values(groupedWorkshops).flat();
      const selected = allWorkshops.find((w) => w.id === id);
      return sum + (selected?.price ?? 0);
    },
    0
  );

  const totalCount = Object.values(selectedWorkshops).filter(
    (id) => id !== null
  ).length;

  const onSubmit = async () => {
    try {
      setSubmitting(true);

      // If we have eventId, save to backend
      if (eventId) {
        // TODO: Add API call to register for workshops
        // await fetch(`/api/workshops/register`, {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     eventId,
        //     registrationId,
        //     workshops: selectedWorkshops
        //   }),
        //   headers: { 'Content-Type': 'application/json' }
        // });

        console.log("Workshop registration data:", {
          eventId,
          registrationId,
          selectedWorkshops,
          totalPrice,
        });
      }

      // Show success message
      alert(
        `Successfully registered for ${totalCount} workshop(s)! Total: ₹${totalPrice}`
      );

      onClose();
    } catch (error) {
      console.error("Error registering for workshops:", error);
      alert("Error registering for workshops. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form when opening/closing
  useEffect(() => {
    if (!open) {
      // Reset selections when closing
      Object.keys(groupedWorkshops).forEach((group) => {
        selectWorkshop(group, null);
      });
    }
  }, [open, groupedWorkshops, selectWorkshop]);

  // Get selected workshop names for display
  const getSelectedWorkshopNames = (): string[] => {
    const names: string[] = [];
    Object.entries(selectedWorkshops).forEach(([group, id]) => {
      if (id !== null) {
        const workshop = groupedWorkshops[group]?.find((w) => w.id === id);
        if (workshop && workshop.name !== "Workshop Not Required") {
          names.push(workshop.name);
        }
      }
    });
    return names;
  };

  const selectedWorkshopNames = getSelectedWorkshopNames();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 border-l border-gray-200"
      >
        <SheetHeader className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <SheetTitle className="text-lg font-semibold text-gray-900">
            Register for Workshops
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable form section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {Object.entries(groupedWorkshops).map(([group, workshops]) => (
            <div
              key={group}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-sm font-semibold text-[#00509E] mb-3">
                {group}
              </h3>
              <RadioGroup
                value={selectedWorkshops[group]?.toString() || "null"}
                onValueChange={(value) =>
                  handleSelect(group, value === "null" ? null : Number(value))
                }
                className="space-y-3"
              >
                {workshops
                  .filter(
                    (workshop) => workshop.name !== "Workshop Not Required"
                  )
                  .map((workshop) => (
                    <div
                      key={workshop.id}
                      className={`flex justify-between items-center p-3 border rounded-lg transition-colors cursor-pointer ${
                        selectedWorkshops[group] === workshop.id
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={workshop.id.toString()}
                          id={`workshop-${group}-${workshop.id}`}
                        />
                        <Label
                          htmlFor={`workshop-${group}-${workshop.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          <div>{workshop.name}</div>
                          {workshop.date && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(workshop.date).toLocaleDateString()} •{" "}
                              {workshop.venue}
                            </div>
                          )}
                        </Label>
                      </div>
                      <div className="text-sm font-semibold text-[#00509E]">
                        {workshop.price > 0
                          ? `₹${workshop.price.toLocaleString("en-IN")}`
                          : "Free"}
                      </div>
                    </div>
                  ))}

                <div
                  className={`flex justify-between items-center p-3 border rounded-lg transition-colors cursor-pointer ${
                    selectedWorkshops[group] === null
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="null"
                      id={`workshop-${group}-none`}
                    />
                    <Label
                      htmlFor={`workshop-${group}-none`}
                      className="text-sm font-medium cursor-pointer text-gray-600"
                    >
                      Not Interested
                    </Label>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    ₹ 0.00
                  </div>
                </div>
              </RadioGroup>
            </div>
          ))}

          {/* Selected workshops summary */}
          {selectedWorkshopNames.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Selected Workshops
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                {selectedWorkshopNames.map((name, index) => (
                  <li key={index}>• {name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fixed footer */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {totalCount} workshop{totalCount !== 1 ? "s" : ""} selected
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00509E]">
                ₹ {totalPrice.toLocaleString("en-IN")}.00
              </div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              className="flex-1 bg-[#00509E] hover:bg-[#003B73]"
              disabled={submitting || totalCount === 0}
            >
              {submitting
                ? "Processing..."
                : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
