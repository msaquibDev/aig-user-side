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
  meal: z.enum(["Veg", "Non-Veg", "Jain"]),
});

const formSchema = z.object({
  people: z.array(personSchema),
});

type FormData = z.infer<typeof formSchema>;

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
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = editId
    ? [people.find((p) => p.id === editId)]
    : [
        {
          name: "",
          relation: "",
          age: "",
          gender: "Female" as const,
          meal: "Veg" as const,
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
              meal: existing.mealPreference as "Veg" | "Non-Veg" | "Jain",
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
            meal: "Veg",
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
        // TODO: Add API call to save accompanying persons
        // await fetch(`/api/registrations/${registrationId}/accompanying`, {
        //   method: 'POST',
        //   body: JSON.stringify(data.people),
        //   headers: { 'Content-Type': 'application/json' }
        // });
      }

      // Also update local store
      data.people.forEach((p) => {
        const parsed = {
          id: p.id ?? Date.now(),
          name: p.name,
          relation: p.relation,
          age: Number(p.age),
          gender: p.gender,
          mealPreference: p.meal,
        };
        if (editId) updatePerson(parsed.id, parsed);
        else addPerson(parsed);
      });

      onClose();
    } catch (error) {
      console.error("Error saving accompanying persons:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const total = fields.length * 8555; // Fixed amount per person

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
                      setValue(`people.${idx}.meal`, val as any)
                    }
                    value={watch(`people.${idx}.meal`)}
                  >
                    <SelectTrigger
                      id={`meal-${idx}`}
                      className="w-full cursor-pointer"
                    >
                      <SelectValue placeholder="Select Meal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Veg">Vegetarian</SelectItem>
                      <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="Jain">Jain</SelectItem>
                    </SelectContent>
                  </Select>
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
                  meal: "Veg",
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
              type="submit"
              form="accompanying-form"
              className="flex-1 bg-[#00509E] hover:bg-[#003B73]"
              disabled={submitting}
            >
              {submitting ? "Saving..." : editId ? "Update" : "Add Persons"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
