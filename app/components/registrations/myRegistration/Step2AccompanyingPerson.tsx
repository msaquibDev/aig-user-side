"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Trash2, PlusCircle } from "lucide-react";

import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

const accompanyingPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Age must be a positive number"
    ),
  gender: z.enum(["male", "female", "other"]),
  relation: z.string().min(1, "Relation is required"),
  mealPreference: z.enum(["veg", "non-veg", "jain"]),
});

const schema = z.object({
  accompanyingPersons: z.array(accompanyingPersonSchema),
});

type FormData = z.infer<typeof schema>;

export default function Step2AccompanyingPerson({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { accompanyingPersons, setAccompanyingPersons } =
    useRegistrationStore();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      accompanyingPersons: accompanyingPersons.length
        ? accompanyingPersons
        : [
            {
              name: "",
              age: "",
              gender: "male",
              relation: "",
              mealPreference: "veg",
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accompanyingPersons",
  });

  const onSubmit = (data: FormData) => {
    setAccompanyingPersons(data.accompanyingPersons);
    toast.success("Accompanying persons saved!");
    onNext();
  };

  const { skipAccompanyingPersons } = useRegistrationStore();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative p-6 rounded-md border space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`accompanyingPersons.${index}.name`}>Name</Label>
              <Input {...register(`accompanyingPersons.${index}.name`)} />
              {errors.accompanyingPersons?.[index]?.name && (
                <p className="text-sm text-red-600">
                  {errors.accompanyingPersons[index]?.name?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`accompanyingPersons.${index}.age`}>Age</Label>
              <Input
                type="number"
                {...register(`accompanyingPersons.${index}.age`)}
              />
              {errors.accompanyingPersons?.[index]?.age && (
                <p className="text-sm text-red-600">
                  {errors.accompanyingPersons[index]?.age?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`accompanyingPersons.${index}.gender`}>
                Gender
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue(`accompanyingPersons.${index}.gender`, val as any)
                }
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select Gender">
                    {watch(`accompanyingPersons.${index}.gender`)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {errors.accompanyingPersons?.[index]?.gender && (
                <p className="text-sm text-red-600">
                  {errors.accompanyingPersons[index]?.gender?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`accompanyingPersons.${index}.relation`}>
                Relation
              </Label>
              <Input {...register(`accompanyingPersons.${index}.relation`)} />
              {errors.accompanyingPersons?.[index]?.relation && (
                <p className="text-sm text-red-600">
                  {errors.accompanyingPersons[index]?.relation?.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`accompanyingPersons.${index}.mealPreference`}>
                Meal Preference
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue(
                    `accompanyingPersons.${index}.mealPreference`,
                    val as any
                  )
                }
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select Meal">
                    {watch(`accompanyingPersons.${index}.mealPreference`)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">Veg</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
                  <SelectItem value="jain">Jain</SelectItem>
                </SelectContent>
              </Select>

              {errors.accompanyingPersons?.[index]?.mealPreference && (
                <p className="text-sm text-red-600">
                  {errors.accompanyingPersons[index]?.mealPreference?.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons aligned below input */}
          <div className="flex justify-between items-center pt-4">
            {index === fields.length - 1 && (
              <Button
                type="button"
                variant="outline"
                className="gap-2 text-[#00509E] border-[#00509E] hover:bg-[#003B73] hover:text-white cursor-pointer"
                onClick={() =>
                  append({
                    name: "",
                    age: "",
                    gender: "male",
                    relation: "",
                    mealPreference: "veg",
                  })
                }
              >
                <PlusCircle className="w-5 h-5" />
                Add Accompanying Person
              </Button>
            )}
            {fields.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
                className="border-red-600 text-red-600 hover:text-white hover:bg-red-600 gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-6 pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-[#00509E] hover:bg-[#003B73] text-white hover:text-white"
        >
          Back
        </Button>
        <Button type="submit" className="bg-[#00509E] hover:bg-[#003B73]">
          Continue
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            skipAccompanyingPersons(); // <-- New store function
            toast.info("Accompanying section skipped");
            onNext();
          }}
          className="text-[#00509E] underline hover:text-[#003B73]"
        >
          Skip
        </Button>
      </div>
    </form>
  );
}
