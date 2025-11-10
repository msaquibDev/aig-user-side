"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useBanquetStore } from "@/app/store/useBanquetStore";
import {
  PlusCircle,
  AlertCircle,
  IndianRupee,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatSlabValidity } from "@/app/utils/formatEventDate";

// Types - Updated based on your API response
type BanquetSlab = {
  _id: string;
  eventId: string;
  banquetslabName: string; // Updated field name
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type AccompanyPerson = {
  _id: string;
  fullName: string;
  relation: string;
  age: number;
  gender: string;
  mealPreference: string;
  isPaid: boolean;
  regNum?: string;
};

type PaidAccompany = {
  _id: string;
  event: {
    _id: string;
    eventName: string;
  };
  registration: {
    _id: string;
    regNum: string;
  };
  paidAccompanies: AccompanyPerson[];
};

// Form Schemas
const banquetEntrySchema = z.object({
  type: z.enum(["self", "accompany", "other"]),
  accompanyId: z.string().optional(),
  otherName: z.string().optional(),
  amount: z.number(),
});

const formSchema = z.object({
  selectedBanquetSlabId: z.string().min(1, "Please select a banquet slab"),
  entries: z.array(banquetEntrySchema),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  eventId?: string | null;
  registrationId?: string | null;
  open: boolean;
  onClose: () => void;
  editId: number | null;
  hasRegistration?: boolean;
};

export default function BanquetFormSidebar({
  eventId,
  registrationId,
  open,
  onClose,
  editId,
  hasRegistration = false,
}: Props) {
  const { addPerson, updatePerson, getPersonById } = useBanquetStore();

  // State for API data
  const [banquetSlabs, setBanquetSlabs] = useState<BanquetSlab[]>([]);
  const [accompanyPersons, setAccompanyPersons] = useState<AccompanyPerson[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [selectedSlab, setSelectedSlab] = useState<BanquetSlab | null>(null);

  // Fetch banquet slabs
  const fetchBanquetSlabs = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/banquets/active`
      );

      const data = await response.json();
      console.log("Fetched banquet slabs:", data);
      if (data.success && Array.isArray(data.data)) {
        setBanquetSlabs(data.data);
      } else {
        toast.error("No active banquet slabs found");
      }
    } catch (error) {
      console.error("Error fetching banquet slabs:", error);
      toast.error("Failed to load banquet options");
    } finally {
      setLoading(false);
    }
  };

  // Fetch accompany persons
  const fetchAccompanyPersons = async () => {
    if (!eventId) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accompanies/paid/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Fetched accompany persons:", data);
      if (data.success && Array.isArray(data.data)) {
        // Extract all accompany persons from paid accompanies
        const allPersons = data.data.flatMap(
          (accompany: PaidAccompany) => accompany.paidAccompanies || []
        );
        setAccompanyPersons(allPersons);
      } else {
        setAccompanyPersons([]);
      }
    } catch (error) {
      console.error("Error fetching accompany persons:", error);
      setAccompanyPersons([]);
    }
  };

  // Load data when sidebar opens
  useEffect(() => {
    if (open && eventId && hasRegistration) {
      const loadData = async () => {
        await fetchBanquetSlabs();
        await fetchAccompanyPersons();
      };
      loadData();
    }
  }, [open, eventId, hasRegistration]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedBanquetSlabId: "",
      entries: [
        {
          type: "self",
          accompanyId: "",
          otherName: "",
          amount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries",
  });

  const entries = watch("entries");
  const selectedBanquetSlabId = watch("selectedBanquetSlabId");

  // Get selected slab details
  const selectedBanquetSlab = banquetSlabs.find(
    (slab) => slab._id === selectedBanquetSlabId
  );

  // Calculate total amount
  const totalAmount = entries.reduce(
    (sum, entry) => sum + (entry.amount || 0),
    0
  );

  // Handle banquet slab selection
  const handleBanquetSlabSelect = (slabId: string) => {
    setValue("selectedBanquetSlabId", slabId);
    const slab = banquetSlabs.find((s) => s._id === slabId);
    setSelectedSlab(slab || null);

    // Update all entries with the new slab amount
    if (slab) {
      fields.forEach((_, index) => {
        setValue(`entries.${index}.amount`, slab.amount);
      });
    }
  };

  // Handle type change
  const handleTypeChange = (
    type: "self" | "accompany" | "other",
    index: number
  ) => {
    setValue(`entries.${index}.type`, type);
    setValue(`entries.${index}.accompanyId`, "");
    setValue(`entries.${index}.otherName`, "");

    // Update amount based on selected slab
    if (selectedBanquetSlab) {
      setValue(`entries.${index}.amount`, selectedBanquetSlab.amount);
    }
  };

  // Handle accompany selection
  const handleAccompanySelect = (accompanyId: string, index: number) => {
    setValue(`entries.${index}.accompanyId`, accompanyId);
  };

  // Add new entry
  const addNewEntry = () => {
    if (!selectedBanquetSlabId) {
      toast.error("Please select a banquet slab first");
      return;
    }

    append({
      type: "self",
      accompanyId: "",
      otherName: "",
      amount: selectedBanquetSlab?.amount || 0,
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!hasRegistration) {
      toast.error("Please complete your event registration first");
      return;
    }

    if (!eventId || !registrationId) {
      toast.error("Event information is missing");
      return;
    }

    try {
      setLoading(true);

      // Prepare banquet registration data
      const banquetData = {
        eventId,
        registrationId,
        banquetSlabId: data.selectedBanquetSlabId,
        banquetEntries: data.entries.map((entry) => ({
          type: entry.type,
          accompanyId:
            entry.type === "accompany" ? entry.accompanyId : undefined,
          otherName: entry.type === "other" ? entry.otherName : undefined,
          amount: entry.amount,
        })),
      };

      // Call banquet registration API
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banquets/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(banquetData),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Banquet registration successful!");

        // If payment is required, initiate payment flow
        if (totalAmount > 0) {
          // TODO: Implement payment integration similar to workshop
          toast.info("Payment integration to be implemented");
        }

        onClose();
        reset();
      } else {
        throw new Error(result.message || "Failed to register for banquet");
      }
    } catch (error: any) {
      console.error("Banquet registration error:", error);
      toast.error(error.message || "Failed to register for banquet");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when opening
  useEffect(() => {
    if (open) {
      reset({
        selectedBanquetSlabId: "",
        entries: [
          {
            type: "self",
            accompanyId: "",
            otherName: "",
            amount: 0,
          },
        ],
      });
      setSelectedSlab(null);
    }
  }, [open, reset]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[40vw] sm:max-w-[40vw] md:w-[35vw] md:max-w-[35vw] lg:w-[30vw] lg:max-w-[30vw] flex flex-col p-0 border-l border-gray-200 transition-all duration-300 ease-in-out">
        <SheetHeader className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <SheetTitle className="text-lg font-semibold text-[#00509E]">
            {editId ? "Edit" : "Book"} Banquet
          </SheetTitle>
        </SheetHeader>

        {!hasRegistration && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 m-4 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">Registration Required</p>
            </div>
            <p className="text-yellow-600 text-sm mt-1">
              Please complete your event registration before booking banquet.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          id="banquet-form"
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50"
        >
          {/* Banquet Slab Selection - Only One Selection Allowed */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Select Banquet Slab *
              </Label>
              {loading ? (
                <div className="text-sm text-gray-500">
                  Loading banquet options...
                </div>
              ) : banquetSlabs.length === 0 ? (
                <div className="text-sm text-red-500">
                  No banquet slabs available
                </div>
              ) : (
                <RadioGroup
                  value={selectedBanquetSlabId}
                  onValueChange={handleBanquetSlabSelect}
                  className="space-y-2"
                >
                  {banquetSlabs.map((slab) => (
                    <Label
                      key={slab._id}
                      htmlFor={`slab-${slab._id}`}
                      className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value={slab._id}
                          id={`slab-${slab._id}`}
                        />
                        <div>
                          <span className="font-medium">
                            {slab.banquetslabName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ₹ {slab.amount.toLocaleString("en-IN")}.00
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatSlabValidity(slab.startDate, slab.endDate)}
                        </p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
              {errors.selectedBanquetSlabId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.selectedBanquetSlabId.message}
                </p>
              )}
            </div>
          </div>

          {/* Entries Section - Only show if banquet slab is selected */}
          {selectedBanquetSlabId && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Banquet Entries for {selectedBanquetSlab?.banquetslabName}
                </Label>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    ₹{selectedBanquetSlab?.amount.toLocaleString("en-IN")} per
                    entry
                  </span>
                </div>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-medium text-[#00509E]">
                      Entry {index + 1}
                    </p>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-gray-400 hover:text-red-600 text-lg font-bold leading-none cursor-pointer p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Type Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Book For *
                      </Label>
                      <Select
                        value={entries[index]?.type || "self"}
                        onValueChange={(
                          value: "self" | "accompany" | "other"
                        ) => handleTypeChange(value, index)}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="accompany">
                            Accompany Person
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Accompany Person Selection */}
                    {entries[index]?.type === "accompany" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Select Accompany Person *
                        </Label>
                        {accompanyPersons.length === 0 ? (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-700 text-sm">
                              No accompany persons found. Please add accompany
                              persons first.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {accompanyPersons.map((person) => (
                              <div
                                key={person._id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={
                                    entries[index]?.accompanyId === person._id
                                  }
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleAccompanySelect(person._id, index);
                                    }
                                  }}
                                  id={`accompany-${person._id}-${index}`}
                                />
                                <Label
                                  htmlFor={`accompany-${person._id}-${index}`}
                                  className="flex-1 cursor-pointer text-sm"
                                >
                                  <div>
                                    <div className="font-medium">
                                      {person.fullName}{" "}
                                      <span className="text-gray-500 text-xs">
                                        ({person.relation})
                                      </span>
                                    </div>
                                    {/* <div className="text-gray-500 text-xs">
                                      {person.relation} • {person.age} years •{" "}
                                      {person.gender}
                                    </div> */}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Other Person Name */}
                    {entries[index]?.type === "other" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Person Name *
                        </Label>
                        <Input
                          placeholder="Enter person name"
                          value={entries[index]?.otherName || ""}
                          onChange={(e) =>
                            setValue(
                              `entries.${index}.otherName`,
                              e.target.value
                            )
                          }
                          className="bg-white"
                        />
                      </div>
                    )}

                    {/* Entry Amount Display */}
                    {entries[index]?.amount > 0 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center text-green-700">
                          <span className="text-sm font-medium">
                            Entry Amount:
                          </span>
                          <span className="font-bold">
                            <IndianRupee className="inline w-3 h-3 mr-1" />
                            {entries[index]?.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full border-[#00509E] text-[#00509E] hover:bg-[#00509E] hover:text-white gap-2 border-dashed"
                onClick={addNewEntry}
              >
                <PlusCircle className="h-4 w-4" />
                Add More Entries
              </Button>
            </div>
          )}
        </form>

        {/* Footer with Total and Submit */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {selectedBanquetSlabId ? (
                <>
                  {fields.length} {selectedBanquetSlab?.banquetslabName} entr
                  {fields.length !== 1 ? "ies" : "y"}
                </>
              ) : (
                "No banquet selected"
              )}
            </div>
            {selectedBanquetSlabId && totalAmount > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-[#00509E]">
                  <IndianRupee className="inline w-4 h-4 mr-1" />
                  {totalAmount.toLocaleString("en-IN")}
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
              type="submit"
              form="banquet-form"
              className="flex-1 bg-[#00509E] hover:bg-[#003B73]"
              disabled={
                loading ||
                !hasRegistration ||
                !selectedBanquetSlabId ||
                totalAmount === 0
              }
            >
              {loading
                ? "Processing..."
                : `Submit & Pay ₹${totalAmount.toLocaleString("en-IN")}`}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
