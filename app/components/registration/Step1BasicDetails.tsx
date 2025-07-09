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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

// ✅ Schema for validation
const schema = z.object({
  prefix: z.string().optional(),
  fullName: z.string().min(1, "Full Name is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email"),
  affiliation: z.string().optional(),
  designation: z.string().optional(),
  registration: z.string().min(1, "Registration is required"),
  councilState: z.string().optional(),
  address: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),

  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),

  mealPreference: z.enum(["veg", "non-veg", "jain"], {
    required_error: "Meal preference is required",
  }),

  registrationCategory: z.enum(["member", "trade", "student", "non-member"], {
    required_error: "Registration category is required",
  }),
});


type FormData = z.infer<typeof schema>;

export default function Step1BasicDetails({ onNext }: { onNext: () => void }) {
  const { basicDetails, updateBasicDetails } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: basicDetails,
  });

  useEffect(() => {
    Object.entries(basicDetails).forEach(([key, value]) => {
      setValue(key as keyof FormData, value as string);
    });
  }, [basicDetails, setValue]);

  const onSubmit = (data: FormData) => {
    updateBasicDetails(data);
    toast.success("Details saved!");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label>Prefix</Label>
          <Select
            onValueChange={(val) => setValue("prefix", val)}
            defaultValue={basicDetails.prefix || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Prefix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
              <SelectItem value="Dr">Dr</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Full Name</Label>
          <Input {...register("fullName")} />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Mobile No.</Label>
          <Input {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Email Id</Label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Affiliation</Label>
          <Input {...register("affiliation")} />
        </div>

        <div className="space-y-1.5">
          <Label>Designation</Label>
          <Input {...register("designation")} />
        </div>

        <div className="space-y-1.5">
          <Label>Medical Council Registration</Label>
          <Input {...register("registration")} />
          {errors.registration && (
            <p className="text-sm text-red-600">
              {errors.registration.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Medical Council State</Label>
          <Input {...register("councilState")} />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Primary Address</Label>
          <Textarea {...register("address")} />
        </div>

        <div className="space-y-1.5">
          <Label>Country</Label>
          <Input {...register("country")} />
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>State</Label>
          <Input {...register("state")} />
        </div>

        <div className="space-y-1.5">
          <Label>City</Label>
          <Input {...register("city")} />
        </div>

        <div className="space-y-1.5">
          <Label>Pincode</Label>
          <Input {...register("pincode")} />
        </div>

        <div className="space-y-1.5">
          <Label>Meal Preference</Label>
          <Select
            onValueChange={(val) =>
              setValue("mealPreference", val as FormData["mealPreference"])
            }
            defaultValue={basicDetails.mealPreference || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Meal Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="veg">Veg</SelectItem>
              <SelectItem value="non-veg">Non-Veg</SelectItem>
              <SelectItem value="jain">Jain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Select
            onValueChange={(val) =>
              setValue("gender", val as FormData["gender"])
            }
            defaultValue={basicDetails.gender || ""}
          >
            <SelectTrigger className="w-full">
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

      {/* Registration Categories */}
      <div className="space-y-2">
        <Label className="font-medium">Select Registration Category</Label>
        <RadioGroup
          defaultValue={basicDetails.registrationCategory}
          onValueChange={(val) =>
            setValue(
              "registrationCategory",
              val as FormData["registrationCategory"]
            )
          }
          className="space-y-2"
        >
          {[
            {
              id: "r1",
              value: "member",
              label: "Member",
              price: "₹ 15,170.00",
            },
            {
              id: "r2",
              value: "trade",
              label: "Trade Delegates",
              price: "₹ 14,000.00",
            },
            {
              id: "r3",
              value: "student",
              label: "Technologists/Students",
              price: "₹ 20,000.00",
            },
            {
              id: "r4",
              value: "non-member",
              label: "Non-Member",
              price: "₹ 28,563.00",
            },
          ].map(({ id, value, label, price }) => (
            <div
              key={id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={value} id={id} />
                <Label htmlFor={id}>{label}</Label>
              </div>
              <div className="text-right">
                <p>{price}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
        {errors.registrationCategory && (
          <p className="text-sm text-red-600">
            {errors.registrationCategory.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="text-center">
        <Button type="submit" className="bg-[#00509E] hover:bg-[#003B73] px-8">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
