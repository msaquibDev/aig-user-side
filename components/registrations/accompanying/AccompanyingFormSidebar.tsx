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
import { useEffect } from "react";
import { useAccompanyingStore } from "@/app/store/useAccompanyingStore";

const personSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  relation: z.string().min(1),
  age: z.string().min(1),
  gender: z.enum(["Male", "Female", "Other"]),
  meal: z.enum(["Veg", "Non-Veg", "Jain"]),
});

const formSchema = z.object({
  people: z.array(personSchema),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  editId?: number | null;
};

export default function AccompanyingFormSidebar({
  open,
  onClose,
  editId,
}: Props) {
  const { people, addPerson, updatePerson } = useAccompanyingStore();

  const defaultValues = editId
    ? [people.find((p) => p.id === editId)]
    : [
        {
          name: "",
          relation: "",
          age: "",
          gender: "Female",
          meal: "Veg",
        },
      ];

  const { register, control, handleSubmit, setValue, watch, reset } =
    useForm<FormData>({
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
    if (editId) {
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
    } else {
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
  }, [editId, reset, people]);

  const onSubmit = (data: FormData) => {
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
  };

  const total = fields.length * 8555;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="flex justify-between items-center px-5 py-4 border-b">
          <SheetTitle className="text-left">
            {editId ? "Edit" : "Add"} Accompanying
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable form section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-5 space-y-6"
          id="accompanying-form"
        >
          {fields.map((field, idx) => (
            <div key={field.id}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-[#00509E]">
                  Accompanying Person {idx + 1}
                </p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-gray-400 hover:text-red-600 text-lg font-bold leading-none cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...register(`people.${idx}.name`)} />
                </div>

                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Select
                    onValueChange={(val) =>
                      setValue(`people.${idx}.relation`, val)
                    }
                    value={watch(`people.${idx}.relation`)}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wife">Wife</SelectItem>
                      <SelectItem value="Husband">Husband</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" {...register(`people.${idx}.age`)} />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    onValueChange={(val) =>
                      setValue(`people.${idx}.gender`, val as any)
                    }
                    value={watch(`people.${idx}.gender`)}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
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
                  <Label>Meal Preference</Label>
                  <Select
                    onValueChange={(val) =>
                      setValue(`people.${idx}.meal`, val as any)
                    }
                    value={watch(`people.${idx}.meal`)}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select Meal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Veg">Veg</SelectItem>
                      <SelectItem value="Non-Veg">Non-Veg</SelectItem>
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
              className="w-full border-[#00509E] text-[#00509E] hover:bg-[#003B73] hover:text-white gap-2"
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
              Add More
            </Button>
          )}
        </form>

        {/* Fixed footer (contained inside drawer) */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">{fields.length}x Accompanying Person</div>
            <div className="flex gap-4 items-center">
              <span className="text-sm font-semibold text-[#00509E]">
                ₹ {total.toLocaleString("en-IN")}.00
              </span>
              <Button
                type="submit"
                form="accompanying-form"
                className="bg-[#00509E] hover:bg-[#003B73]"
              >
                {editId ? "Update" : "Checkout"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
