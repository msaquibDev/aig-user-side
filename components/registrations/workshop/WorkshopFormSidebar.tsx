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
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  IndianRupee,
  Calendar,
  MapPin,
  Users,
  FolderOpen,
  CreditCard,
  Tag,
} from "lucide-react";

type Workshop = {
  _id: string;
  eventId: string;
  workshopName: string;
  workshopType: string;
  workshopCategory: string;
  workshopRegistrationType: "Paid" | "Free";
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
        workshopCategory: workshop?.workshopCategory,
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

  // Group workshops by registration type first, then by category
  const groupedWorkshops = apiWorkshops.reduce((groups, workshop) => {
    const registrationType =
      workshop.workshopRegistrationType === "Paid" ? "Paid" : "Free";
    const category =
      workshop.workshopCategory || workshop.workshopType || "Other";

    // Create main registration type group if it doesn't exist
    if (!groups[registrationType]) {
      groups[registrationType] = {};
    }

    // Create category subgroup if it doesn't exist
    if (!groups[registrationType][category]) {
      groups[registrationType][category] = [];
    }

    groups[registrationType][category].push(workshop);
    return groups;
  }, {} as Record<string, Record<string, Workshop[]>>);

  // Sort registration types (Paid first, then Free)
  const sortedRegistrationTypes = Object.keys(groupedWorkshops).sort((a, b) => {
    if (a === "Paid") return -1;
    if (b === "Paid") return 1;
    return 0;
  });

  // Sort categories alphabetically within each registration type
  sortedRegistrationTypes.forEach((registrationType) => {
    const categories = Object.keys(groupedWorkshops[registrationType]);
    categories.sort((a, b) => a.localeCompare(b));

    // Sort workshops within each category
    categories.forEach((category) => {
      if (registrationType === "Paid") {
        groupedWorkshops[registrationType][category].sort(
          (a, b) => b.amount - a.amount
        );
      } else {
        groupedWorkshops[registrationType][category].sort((a, b) =>
          a.workshopName.localeCompare(b.workshopName)
        );
      }
    });
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
            sortedRegistrationTypes.map((registrationType) => (
              <div key={registrationType} className="space-y-4">
                {/* Registration Type Header */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {registrationType} Workshops
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                      registrationType === "Paid"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {registrationType === "Paid" ? (
                      <>
                        <CreditCard className="w-3 h-3" />
                        Paid
                      </>
                    ) : (
                      <>
                        <Tag className="w-3 h-3" />
                        Free
                      </>
                    )}
                  </span>
                </div>

                {/* Categories within this registration type */}
                <div className="grid gap-4">
                  {Object.keys(groupedWorkshops[registrationType])
                    .sort((a, b) => a.localeCompare(b))
                    .map((category) => {
                      const workshops =
                        groupedWorkshops[registrationType][category];

                      return (
                        <div
                          key={category}
                          className={`
                            bg-white rounded-lg border-2 p-4 transition-all
                            ${
                              registrationType === "Paid"
                                ? "border-blue-200 hover:border-blue-300"
                                : "border-green-200 hover:border-green-300"
                            }
                            shadow-sm hover:shadow-md
                          `}
                        >
                          {/* Category Header */}
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                            <FolderOpen
                              className={`
                              w-4 h-4
                              ${
                                registrationType === "Paid"
                                  ? "text-blue-600"
                                  : "text-green-600"
                              }
                            `}
                            />
                            <h4 className="text-sm font-semibold text-gray-800">
                              {category}
                            </h4>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {workshops.length} workshop
                              {workshops.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Workshops in this category */}
                          <div className="space-y-3">
                            {workshops.map((workshop) => {
                              const canRegister =
                                canRegisterForWorkshop(workshop);
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
                                  className={`
                                    flex justify-between items-start p-3 border rounded-lg transition-all
                                    ${
                                      isSelected
                                        ? registrationType === "Paid"
                                          ? "border-blue-300 bg-blue-50"
                                          : "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }
                                    ${
                                      isDisabled
                                        ? "opacity-60 cursor-not-allowed"
                                        : "cursor-pointer hover:shadow-sm"
                                    }
                                  `}
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
                                      className={`
                                        mt-1
                                        ${
                                          isSelected
                                            ? registrationType === "Paid"
                                              ? "text-blue-600 border-blue-600"
                                              : "text-green-600 border-green-600"
                                            : ""
                                        }
                                      `}
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
                                        <div className="text-xs text-gray-600">
                                          <div className="font-semibold text-gray-800 text-sm mb-1">
                                            {workshop.workshopName}
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <Calendar className="w-3 h-3 text-gray-500" />
                                              <span>
                                                {workshop.startDate} |{" "}
                                                {workshop.startTime} -{" "}
                                                {workshop.endTime}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <MapPin className="w-3 h-3 text-gray-500" />
                                              <span>{workshop.hallName}</span>
                                            </div>
                                            {workshop.maxRegAllowed > 0 && (
                                              <div className="flex items-center gap-2">
                                                <Users className="w-3 h-3 text-gray-500" />
                                                <span>
                                                  Max: {workshop.maxRegAllowed}{" "}
                                                  participants
                                                </span>
                                              </div>
                                            )}
                                          </div>
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
                                  <div className="text-sm font-semibold whitespace-nowrap ml-2">
                                    {workshop.amount > 0 ? (
                                      <div
                                        className={`
                                        flex items-center px-2 py-1 rounded-full
                                        ${
                                          registrationType === "Paid"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                        }
                                      `}
                                      >
                                        <IndianRupee className="w-3 h-3 mr-1" />
                                        {workshop.amount.toLocaleString(
                                          "en-IN"
                                        )}
                                      </div>
                                    ) : (
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        Free
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
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
            <div
              className={`
              border-2 rounded-lg p-4
              ${
                isPaidWorkshopSelected
                  ? "bg-blue-50 border-blue-200"
                  : "bg-green-50 border-green-200"
              }
            `}
            >
              <h4
                className={`
                text-sm font-semibold mb-2 flex items-center gap-2
                ${isPaidWorkshopSelected ? "text-blue-800" : "text-green-800"}
              `}
              >
                <CheckCircle className="w-4 h-4" />
                Selected {isFreeWorkshopSelected ? "Free" : "Paid"} Workshops (
                {totalCount})
              </h4>
              <ul
                className={`
                text-sm space-y-1
                ${isPaidWorkshopSelected ? "text-blue-700" : "text-green-700"}
              `}
              >
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
                <div className="text-2xl font-bold text-blue-600 flex items-center">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {totalPrice.toLocaleString("en-IN")}
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
              className={`
                flex-1 
                ${
                  isPaidWorkshopSelected
                    ? "bg-[#00509E] hover:bg-[#003B73]"
                    : "bg-green-600 hover:bg-green-700"
                }
              `}
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
