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
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useBanquetStore } from "@/app/store/useBanquetStore";
import { PlusCircle } from "lucide-react";

const personSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  relation: z.string().min(1),
  age: z.string().min(1),
  gender: z.enum(["Male", "Female", "Other"]),
  meal: z.enum(["Veg", "Non-Veg"]),
});

const formSchema = z.object({
  people: z.array(personSchema),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  editId: number | null;
};

export default function BanquetFormSidebar({ open, onClose, editId }: Props) {
  const { addPerson, updatePerson, getPersonById } = useBanquetStore();

  const defaultValues = editId
    ? [getPersonById(editId)]
    : [
        {
          name: "",
          relation: "",
          age: "",
          gender: "Male",
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
      const existing = getPersonById(editId);
      if (existing) {
        reset({
          people: [
            {
              id: existing.id,
              name: existing.name,
              relation: existing.relation,
              age: String(existing.age),
              gender: existing.gender as "Male" | "Female" | "Other",
              meal: existing.mealPreference as "Veg" | "Non-Veg",
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
            gender: "Male",
            meal: "Veg",
          },
        ],
      });
    }
  }, [editId, reset, getPersonById]);

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
      <SheetContent className="w-full sm:w-[40vw] sm:max-w-[40vw] md:w-[35vw] md:max-w-[35vw] lg:w-[30vw] lg:max-w-[30vw] flex flex-col p-0 border-l border-gray-200 transition-all duration-300 ease-in-out">
        <SheetHeader className="flex justify-between items-center px-5 py-4 border-b">
          <SheetTitle className="text-lg font-semibold text-[#00509E]">
            {editId ? "Edit" : "Book"} Banquet
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          id="banquet-form"
          className="flex-1 overflow-y-auto p-5 space-y-6"
        >
          {fields.map((field, idx) => (
            <div key={field.id}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-[#00509E]">
                  Person {idx + 1}
                </p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-gray-400 hover:text-red-600 text-lg font-bold leading-none"
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
                  <Input {...register(`people.${idx}.relation`)} />
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
                  gender: "Male",
                  meal: "Veg",
                })
              }
            >
              <PlusCircle className="h-4 w-4" />
              Add More
            </Button>
          )}
        </form>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">{fields.length} x Banquet Seat</div>
            <div className="flex gap-4 items-center">
              <span className="text-sm font-semibold text-[#00509E]">
                ₹ {total.toLocaleString("en-IN")}.00
              </span>
              <Button
                type="submit"
                form="banquet-form"
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
