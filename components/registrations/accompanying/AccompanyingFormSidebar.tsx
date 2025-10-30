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
import { PlusCircle, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAccompanyingStore } from "@/app/store/useAccompanyingStore";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { toast } from "sonner";

const personSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      "Age must be a valid number"
    ),
  gender: z.enum(["Male", "Female", "Other"]),
  mealPreference: z.string().min(1, "Meal preference is required"),
});

const formSchema = z.object({
  people: z.array(personSchema),
});

type FormData = z.infer<typeof formSchema>;

type MealPreference = {
  _id: string;
  eventId: string;
  mealName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type RegistrationSlab = {
  _id: string;
  eventId: string;
  slabName: string;
  amount: number;
  AccompanyAmount: number;
  startDate: string;
  endDate: string;
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

export default function AccompanyingFormSidebar({
  eventId,
  registrationId,
  open,
  onClose,
  editId,
}: Props) {
  const { people, addPerson, updatePerson } = useAccompanyingStore();
  const { basicDetails } = useRegistrationStore();
  const [submitting, setSubmitting] = useState(false);
  const [mealPreferences, setMealPreferences] = useState<MealPreference[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [accompanyAmount, setAccompanyAmount] = useState(0);
  const [loadingSlabs, setLoadingSlabs] = useState(false);

  // Fetch registration slabs to get AccompanyAmount
  // Update the fetchRegistrationSlabs function with better debugging and matching logic
  const fetchRegistrationSlabs = async (eventId: string) => {
    try {
      setLoadingSlabs(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/slabs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      console.log("Registration Slabs Response (Accompanying):", data);

      if (data.success && Array.isArray(data.data)) {
        // Get the selected registration category
        const selectedCategory = basicDetails.registrationCategory as any;
        console.log("Selected registration category:", selectedCategory);

        // If we have a selected category, try to match by _id first
        if (selectedCategory && selectedCategory._id) {
          const selectedSlab = data.data.find(
            (slab: RegistrationSlab) => slab._id === selectedCategory._id
          );

          if (selectedSlab) {
            setAccompanyAmount(selectedSlab.AccompanyAmount || 0);
            console.log(
              "Found AccompanyAmount by _id:",
              selectedSlab.AccompanyAmount
            );
            return;
          }
        }

        // If no match by _id, try to match by slabName
        if (selectedCategory && selectedCategory.slabName) {
          const selectedSlab = data.data.find(
            (slab: RegistrationSlab) =>
              slab.slabName === selectedCategory.slabName
          );

          if (selectedSlab) {
            setAccompanyAmount(selectedSlab.AccompanyAmount || 0);
            console.log(
              "Found AccompanyAmount by slabName:",
              selectedSlab.AccompanyAmount
            );
            return;
          }
        }

        // If still no match, use the first available slab
        const firstSlab = data.data[0];
        if (firstSlab) {
          setAccompanyAmount(firstSlab.AccompanyAmount || 0);
          console.log(
            "Using first slab AccompanyAmount:",
            firstSlab.AccompanyAmount
          );
        } else {
          setAccompanyAmount(0);
          console.log("No slabs available, setting amount to 0");
        }
      } else {
        console.error("Invalid response format for slabs:", data);
        setAccompanyAmount(0);
      }
    } catch (err) {
      console.error("GET registration slabs error:", err);
      setAccompanyAmount(0);
    } finally {
      setLoadingSlabs(false);
    }
  };

  // Also add a useEffect to debug the basicDetails
  useEffect(() => {
    console.log("Current basicDetails:", basicDetails);
    console.log("Registration Category:", basicDetails.registrationCategory);
  }, [basicDetails]);

  // Fetch meal preferences
  const fetchMealPreferences = async (eventId: string) => {
    try {
      setLoadingMeals(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/meal-preferences/active`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Meal Preferences Response (Accompanying):", data);

      if (data.success && Array.isArray(data.data)) {
        setMealPreferences(data.data);
      } else {
        console.error("Failed to fetch meal preferences:", data);
        // Fallback to default options if API fails
        setMealPreferences([
          {
            _id: "1",
            eventId: eventId,
            mealName: "Vegetarian",
            status: "Active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          },
          {
            _id: "2",
            eventId: eventId,
            mealName: "Non-Vegetarian",
            status: "Active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          },
        ]);
      }
    } catch (err) {
      console.error("GET meal preferences error:", err);
      // Fallback to default options
      setMealPreferences([
        {
          _id: "1",
          eventId: eventId,
          mealName: "Vegetarian",
          status: "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
        {
          _id: "2",
          eventId: eventId,
          mealName: "Non-Vegetarian",
          status: "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
      ]);
    } finally {
      setLoadingMeals(false);
    }
  };

  // Fetch both meal preferences and registration slabs when sidebar opens
  useEffect(() => {
    if (open && eventId) {
      fetchMealPreferences(eventId);
      fetchRegistrationSlabs(eventId);
    }
  }, [open, eventId]);

  const defaultValues = editId
    ? [people.find((p) => p.id === editId)]
    : [
        {
          name: "",
          relation: "",
          age: "",
          gender: "Female" as const,
          mealPreference: "",
        },
      ];

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
      people: defaultValues as any,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  useEffect(() => {
    if (editId && open) {
      const existing = people.find((p) => p.id === editId);
      if (existing) {
        reset({
          people: [
            {
              id: existing.id,
              name: existing.name,
              relation: existing.relation,
              age: String(existing.age),
              gender: existing.gender as "Male" | "Female" | "Other",
              mealPreference: existing.mealPreference,
            },
          ],
        });
      }
    } else if (open) {
      reset({
        people: [
          {
            name: "",
            relation: "",
            age: "",
            gender: "Female",
            mealPreference: "",
          },
        ],
      });
    }
  }, [editId, reset, people, open]);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);

      // If we have eventId and registrationId, save to backend
      if (eventId && registrationId) {
        // API call to save accompanying persons
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/${registrationId}/accompanying-persons`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              accompanyingPersons: data.people.map((person) => ({
                name: person.name,
                relation: person.relation,
                age: Number(person.age),
                gender: person.gender,
                mealPreference: person.mealPreference,
              })),
            }),
          }
        );

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to save accompanying persons"
          );
        }
      }

      // Also update local store
      data.people.forEach((p) => {
        const parsed = {
          id: p.id ?? Date.now(),
          name: p.name,
          relation: p.relation,
          age: Number(p.age),
          gender: p.gender,
          mealPreference: p.mealPreference,
        };
        if (editId) updatePerson(parsed.id, parsed);
        else addPerson(parsed);
      });

      toast.success(
        editId ? "Person updated successfully!" : "Persons added successfully!"
      );
      onClose();
    } catch (error) {
      console.error("Error saving accompanying persons:", error);
      toast.error("Failed to save accompanying persons");
    } finally {
      setSubmitting(false);
    }
  };

  const total = fields.length * accompanyAmount;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 border-l border-gray-200"
      >
        <SheetHeader className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <SheetTitle className="text-lg font-semibold text-gray-900">
            {editId ? "Edit" : "Add"} Accompanying Person
            {fields.length > 1 ? "s" : ""}
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable form section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50"
          id="accompanying-form"
        >
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-medium text-[#00509E]">
                  Person {idx + 1}
                </p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-gray-400 hover:text-red-600 text-lg font-bold leading-none cursor-pointer p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`name-${idx}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id={`name-${idx}`}
                    {...register(`people.${idx}.name`)}
                    className={
                      errors.people?.[idx]?.name ? "border-red-500" : ""
                    }
                  />
                  {errors.people?.[idx]?.name && (
                    <p className="text-red-500 text-xs">
                      {errors.people[idx]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`relation-${idx}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Relation *
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      setValue(`people.${idx}.relation`, val)
                    }
                    value={watch(`people.${idx}.relation`)}
                  >
                    <SelectTrigger
                      id={`relation-${idx}`}
                      className={`w-full cursor-pointer ${
                        errors.people?.[idx]?.relation ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wife">Wife</SelectItem>
                      <SelectItem value="Husband">Husband</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.people?.[idx]?.relation && (
                    <p className="text-red-500 text-xs">
                      {errors.people[idx]?.relation?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`age-${idx}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Age *
                  </Label>
                  <Input
                    id={`age-${idx}`}
                    type="number"
                    {...register(`people.${idx}.age`)}
                    className={
                      errors.people?.[idx]?.age ? "border-red-500" : ""
                    }
                  />
                  {errors.people?.[idx]?.age && (
                    <p className="text-red-500 text-xs">
                      {errors.people[idx]?.age?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`gender-${idx}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Gender *
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      setValue(`people.${idx}.gender`, val as any)
                    }
                    value={watch(`people.${idx}.gender`)}
                  >
                    <SelectTrigger
                      id={`gender-${idx}`}
                      className="w-full cursor-pointer"
                    >
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`meal-${idx}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Meal Preference *
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      setValue(`people.${idx}.mealPreference`, val)
                    }
                    value={watch(`people.${idx}.mealPreference`)}
                    disabled={loadingMeals}
                  >
                    <SelectTrigger
                      id={`meal-${idx}`}
                      className="w-full cursor-pointer"
                    >
                      <SelectValue
                        placeholder={
                          loadingMeals
                            ? "Loading meal preferences..."
                            : "Select Meal Preference"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {mealPreferences.map((meal) => (
                        <SelectItem key={meal._id} value={meal.mealName}>
                          {meal.mealName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.people?.[idx]?.mealPreference && (
                    <p className="text-red-500 text-xs">
                      {errors.people[idx]?.mealPreference?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!editId && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#00509E] text-[#00509E] hover:bg-[#00509E] hover:text-white gap-2 border-dashed"
              onClick={() =>
                append({
                  name: "",
                  relation: "",
                  age: "",
                  gender: "Female",
                  mealPreference: "",
                })
              }
            >
              <PlusCircle className="h-4 w-4" />
              Add Another Person
            </Button>
          )}
        </form>

        {/* Fixed footer */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {fields.length} person{fields.length !== 1 ? "s" : ""}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00509E]">
                ₹ {total.toLocaleString("en-IN")}.00
              </div>
              <div className="text-sm text-gray-500">
                {loadingSlabs
                  ? "Loading fee..."
                  : accompanyAmount > 0
                  ? `₹ ${accompanyAmount.toLocaleString("en-IN")}.00 per person`
                  : "No accompanying fee"}
              </div>
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
              type="submit"
              form="accompanying-form"
              className="flex-1 bg-[#00509E] hover:bg-[#003B73]"
              disabled={submitting || loadingMeals || loadingSlabs}
            >
              {submitting ? "Saving..." : editId ? "Update" : "Add Persons"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
