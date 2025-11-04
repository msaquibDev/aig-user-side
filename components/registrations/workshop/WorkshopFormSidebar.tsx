"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWorkshopStore } from "@/app/store/useWorkshopStore";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

type Workshop = {
  _id: string;
  eventId: string;
  workshopName: string;
  workshopType: string;
  hallName: string;
  amount: number;
  maxRegAllowed: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isEventRegistrationRequired: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

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
  const { selectedWorkshops, selectWorkshop } = useWorkshopStore();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiWorkshops, setApiWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopIds, setSelectedWorkshopIds] = useState<string[]>([]);
  const [selectedWorkshopType, setSelectedWorkshopType] = useState<
    "paid" | "free" | null
  >(null);

  // Fetch workshops from API when sidebar opens
  useEffect(() => {
    const fetchWorkshops = async () => {
      if (!eventId || !open) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/active-workshops`
        );

        const data = await response.json();
        console.log("Fetched workshops:", data);

        if (data.success && Array.isArray(data.data)) {
          setApiWorkshops(data.data);
        } else {
          setError("No workshops found for this event");
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
        setError("Failed to load workshops");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [eventId, open]);

  // Check if user can register for workshop
  const canRegisterForWorkshop = (workshop: Workshop): boolean => {
    if (!workshop.isEventRegistrationRequired) {
      return true;
    }
    return registrationId !== null;
  };

  // Handle workshop selection
  const handleWorkshopSelect = (
    workshopId: string,
    isSelected: boolean,
    workshopAmount: number
  ) => {
    const workshop = apiWorkshops.find((w) => w._id === workshopId);
    if (!workshop) return;

    const workshopType = workshop.amount > 0 ? "paid" : "free";

    // Check if user is trying to mix paid and free workshops
    if (
      selectedWorkshopType &&
      selectedWorkshopType !== workshopType &&
      isSelected
    ) {
      alert(
        `You cannot select both paid and free workshops at the same time. Please deselect ${selectedWorkshopType} workshops first.`
      );
      return;
    }

    if (isSelected) {
      // Add to existing selection (allow multiple of same type)
      setSelectedWorkshopIds((prev) => [...prev, workshopId]);
      setSelectedWorkshopType(workshopType);
    } else {
      // Remove from selection
      const newSelectedIds = selectedWorkshopIds.filter(
        (id) => id !== workshopId
      );
      setSelectedWorkshopIds(newSelectedIds);

      // Reset workshop type if no workshops selected
      if (newSelectedIds.length === 0) {
        setSelectedWorkshopType(null);
      }
    }
  };

  // Get selected workshops data
  const getSelectedWorkshopsData = () => {
    return selectedWorkshopIds.map((id) => {
      const workshop = apiWorkshops.find((w) => w._id === id);
      return {
        workshopId: workshop?._id,
        workshopName: workshop?.workshopName,
        workshopType: workshop?.workshopType,
        amount: workshop?.amount || 0,
        isEventRegistrationRequired:
          workshop?.isEventRegistrationRequired || false,
      };
    });
  };

  // Calculate total price
  const totalPrice = selectedWorkshopIds.reduce((sum, id) => {
    const workshop = apiWorkshops.find((w) => w._id === id);
    return sum + (workshop?.amount || 0);
  }, 0);

  const totalCount = selectedWorkshopIds.length;

  const isFreeWorkshopSelected = selectedWorkshopType === "free";
  const isPaidWorkshopSelected = selectedWorkshopType === "paid";

  const onSubmit = async () => {
    try {
      setSubmitting(true);

      const selectedWorkshopData = getSelectedWorkshopsData();

      console.log("Workshop registration data:", {
        eventId,
        registrationId,
        selectedWorkshops: selectedWorkshopData,
        totalPrice,
        workshopType: selectedWorkshopType,
      });

      // Different API calls based on workshop type
      if (isFreeWorkshopSelected) {
        // Free workshop registration API
        // await fetch(`/api/workshops/register-free`, {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     eventId,
        //     registrationId,
        //     workshops: selectedWorkshopData
        //   }),
        //   headers: { 'Content-Type': 'application/json' }
        // });
        console.log("Calling FREE workshop registration API");
      } else if (isPaidWorkshopSelected) {
        // Paid workshop registration API
        // await fetch(`/api/workshops/register-paid`, {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     eventId,
        //     registrationId,
        //     workshops: selectedWorkshopData,
        //     totalAmount: totalPrice
        //   }),
        //   headers: { 'Content-Type': 'application/json' }
        // });
        console.log("Calling PAID workshop registration API");
      }

      // Show success message
      alert(
        `Successfully registered for ${totalCount} ${
          isFreeWorkshopSelected ? "free" : "paid"
        } workshop(s)!${isPaidWorkshopSelected ? ` Total: ₹${totalPrice}` : ""}`
      );

      // Reset selections and close
      setSelectedWorkshopIds([]);
      setSelectedWorkshopType(null);
      onClose();
    } catch (error) {
      console.error("Error registering for workshops:", error);
      alert("Error registering for workshops. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setSelectedWorkshopIds([]);
      setSelectedWorkshopType(null);
    }
  }, [open]);

  // Group workshops by amount (paid/free) instead of workshopType
  const groupedWorkshops = apiWorkshops.reduce((groups, workshop) => {
    const group = workshop.amount > 0 ? "Paid Workshops" : "Free Workshops";
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(workshop);
    return groups;
  }, {} as Record<string, Workshop[]>);

  // Sort workshops within each group by amount (highest first for paid, any order for free)
  Object.keys(groupedWorkshops).forEach((group) => {
    if (group === "Paid Workshops") {
      groupedWorkshops[group].sort((a, b) => b.amount - a.amount);
    }
  });

  // Get selected workshop names for display
  const getSelectedWorkshopNames = (): string[] => {
    return selectedWorkshopIds
      .map((id) => {
        const workshop = apiWorkshops.find((w) => w._id === id);
        return workshop?.workshopName || "";
      })
      .filter((name) => name);
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <p className="text-gray-600">Loading workshops...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : apiWorkshops.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No workshops available for this event.</p>
            </div>
          ) : (
            Object.entries(groupedWorkshops).map(([group, workshops]) => (
              <div
                key={group}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <h3 className="text-sm font-semibold text-[#00509E] mb-3">
                  {group}
                </h3>
                <div className="space-y-3">
                  {workshops.map((workshop) => {
                    const canRegister = canRegisterForWorkshop(workshop);
                    const isSelected = selectedWorkshopIds.includes(
                      workshop._id
                    );
                    const isDisabled =
                      !canRegister ||
                      (selectedWorkshopType != null &&
                        selectedWorkshopType !==
                          (workshop.amount > 0 ? "paid" : "free") &&
                        !isSelected);

                    return (
                      <div
                        key={workshop._id}
                        className={`flex justify-between items-start p-3 border rounded-lg transition-colors ${
                          isSelected
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${
                          isDisabled
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (!isDisabled) {
                                handleWorkshopSelect(
                                  workshop._id,
                                  checked as boolean,
                                  workshop.amount
                                );
                              }
                            }}
                            disabled={isDisabled}
                            id={`workshop-${workshop._id}`}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`workshop-${workshop._id}`}
                              className={`text-sm font-medium ${
                                isDisabled
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isDisabled) {
                                  handleWorkshopSelect(
                                    workshop._id,
                                    !isSelected,
                                    workshop.amount
                                  );
                                }
                              }}
                            >
                              <div>{workshop.workshopName}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Type: {workshop.workshopType}
                                <br />
                                {workshop.startDate} • {workshop.startTime} -{" "}
                                {workshop.endTime}
                                <br />
                                Venue: {workshop.hallName}
                                <br />
                                Max Participants: {workshop.maxRegAllowed}
                              </div>
                              {!canRegister && (
                                <div className="flex items-center gap-1 mt-1 text-orange-600 text-xs">
                                  <AlertCircle className="w-3 h-3" />
                                  Event registration required
                                </div>
                              )}
                              {isDisabled &&
                                !isSelected &&
                                selectedWorkshopType && (
                                  <div className="flex items-center gap-1 mt-1 text-gray-600 text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    Cannot mix paid and free workshops
                                  </div>
                                )}
                            </Label>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-[#00509E] whitespace-nowrap ml-2">
                          {workshop.amount > 0
                            ? `₹${workshop.amount.toLocaleString("en-IN")}`
                            : "Free"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Selected workshops summary */}
          {selectedWorkshopNames.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Selected {isFreeWorkshopSelected ? "Free" : "Paid"} Workshops (
                {totalCount})
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
              {totalCount}{" "}
              {isFreeWorkshopSelected
                ? "free"
                : isPaidWorkshopSelected
                ? "paid"
                : ""}{" "}
              workshop{totalCount !== 1 ? "s" : ""} selected
            </div>
            {isPaidWorkshopSelected && (
              <div className="text-right">
                <div className="text-2xl font-bold text-[#00509E]">
                  ₹ {totalPrice.toLocaleString("en-IN")}
                </div>
                <div className="text-sm text-gray-500">Total Amount</div>
              </div>
            )}
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
              disabled={submitting || totalCount === 0 || loading}
            >
              {submitting
                ? "Processing..."
                : isFreeWorkshopSelected
                ? "Register for Free"
                : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
