"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

// 👇 Zod schema
const schema = z.object({
  name: z.string().optional(),
  age: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      "Age must be a positive number"
    ),
  gender: z.enum(["male", "female", "other"]).optional(),
});

type FormData = z.infer<typeof schema>;

export default function Step2AccompanyingPerson({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { accompanyingPerson, updateAccompanyingPerson } =
    useRegistrationStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: accompanyingPerson ?? {
      name: "",
      age: "",
      gender: undefined, // ✅ don't default to empty string
    },
  });

  // Prefill from Zustand
  useEffect(() => {
    if (accompanyingPerson) {
      setValue("name", accompanyingPerson.name || "");
      setValue("age", accompanyingPerson.age || "");
      setValue(
        "gender",
        (accompanyingPerson.gender as FormData["gender"]) ?? undefined
      );
    }
  }, [accompanyingPerson, setValue]);

  const onSubmit = (data: FormData) => {
    updateAccompanyingPerson(data);
    toast.success("Accompanying person saved!");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold text-[#003B73]">
        Accompanying Person (Optional)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input type="number" {...register("age")} />
          {errors.age && (
            <p className="text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(val) =>
              setValue("gender", val as FormData["gender"])
            }
            defaultValue={accompanyingPerson?.gender ?? undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-[#00509E] text-white hover:bg-[#003B73]"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
