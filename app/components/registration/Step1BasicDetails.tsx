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

const schema = z.object({
  prefix: z.string(),
  fullName: z.string().min(1, "Full Name is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email"),
  affiliation: z.string().optional(),
  designation: z.string().optional(),
  registration: z.string().min(1),
  councilState: z.string().optional(),
  address: z.string().optional(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  pincode: z.string(),
  gender: z.enum(["male", "female", "other"]),
  mealPreference: z.enum(["veg", "non-veg", "jain"]).optional(),
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
            defaultValue={basicDetails.prefix}
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
            defaultValue={basicDetails.mealPreference}
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
            defaultValue={basicDetails.gender}
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
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="member" id="r1" />
              <Label htmlFor="r1">Member</Label>
            </div>
            <div className="text-right">
              <p>₹ 15,170.00</p>
              <p className="text-sm text-muted-foreground">₹ 0.00</p>
            </div>
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="trade" id="r2" />
              <Label htmlFor="r2">Trade Delegates</Label>
            </div>
            <div className="text-right">
              <p>₹ 14,000.00</p>
              <p className="text-sm text-muted-foreground">₹ 14,000.00</p>
            </div>
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="student" id="r3" />
              <Label htmlFor="r3">Technologists/Students</Label>
            </div>
            <div className="text-right">
              <p>₹ 20,000.00</p>
              <p className="text-sm text-muted-foreground">₹ 20,000.00</p>
            </div>
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="non-member" id="r4" />
              <Label htmlFor="r4">Non-Member</Label>
            </div>
            <div className="text-right">
              <p>₹ 28,563.00</p>
              <p className="text-sm text-muted-foreground">₹ 28,563.00</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button type="submit" className="bg-[#00509E] hover:bg-[#003B73] px-8">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
