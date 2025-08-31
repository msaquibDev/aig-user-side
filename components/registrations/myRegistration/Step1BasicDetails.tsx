"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  RegistrationCategory,
  useRegistrationStore,
} from "@/app/store/useRegistrationStore";
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
import CountryStateCitySelect from "@/components/common/CountryStateCitySelect";

// ✅ Schema for validation
const schema = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  fullName: z.string().min(1, "Full Name is required"),
  phone: z.string().regex(/^\d{10}$/, { message: "Mobile must be 10 digits" }),
  email: z.string().email("Invalid email"),
  affiliation: z.string().min(1, "Affiliation is required"),
  designation: z.string().optional(),
  medicalCouncilRegistration: z.string().min(1, "Registration is required"),
  medicalCouncilState: z.string().optional(),
  address: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),

  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),

  mealPreference: z.enum(["Veg", "Non-Veg", "Jain"], {
    required_error: "Meal preference is required",
  }),

  // registrationCategory: z.enum(["Member", "Trade", "Student", "Non-Member"], {
  // required_error: "Registration category is required",
  // }),
  registrationCategory: z.object({
    _id: z.string(),
    categoryName: z.string(),
    amount: z.number(),
  }),
});

type FormData = z.infer<typeof schema>;

export default function Step1BasicDetails({ onNext }: { onNext: () => void }) {
  const { basicDetails, updateBasicDetails } = useRegistrationStore();
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: basicDetails,
  });

  // Prefill form when basicDetails changes
  useEffect(() => {
    reset(basicDetails);
  }, [basicDetails, reset]);

  const onSubmit = (data: FormData) => {
    updateBasicDetails(data);
    toast.success("Details saved!");
    onNext();
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/user/registrationCategory", {
          method: "GET",
        });
        const data = await res.json();
        console.log("Category Response:", data);

        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("GET categories error:", err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          {/* <Label>Prefix</Label>
          <Select
            onValueChange={(val) => setValue("prefix", val)}
            defaultValue={basicDetails.prefix || ""}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select Prefix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
              <SelectItem value="Dr">Dr</SelectItem>
            </SelectContent>
          </Select> */}
          <Label htmlFor="prefix">
            Prefix <span className="text-red-600">*</span>
          </Label>
          <Input
            id="prefix"
            placeholder="Eg: Dr, Mr, Ms"
            {...register("prefix")}
          />
          {errors.prefix && (
            <p className="text-sm text-red-600">{errors.prefix.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Full Name <span className="text-red-600">*</span>
          </Label>
          <Input {...register("fullName")} />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Mobile No. <span className="text-red-600">*</span>
          </Label>
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={10} // still keeps native mobile keypad correct
            {...register("phone")}
            onInput={(e) => {
              let val = e.currentTarget.value.replace(/\D/g, ""); // allow only digits
              if (val.length > 10) val = val.slice(0, 10); // trim to 10 digits
              e.currentTarget.value = val;
            }}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Email Id <span className="text-red-600">*</span>
          </Label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Affiliation <span className="text-red-600">*</span>
          </Label>
          <Input {...register("affiliation")} />
          {errors.affiliation && (
            <p className="text-sm text-red-600">{errors.affiliation.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Designation</Label>
          <Input {...register("designation")} />
        </div>

        <div className="space-y-1.5">
          <Label>Medical Council Registration</Label>
          <Input {...register("medicalCouncilRegistration")} />
          {errors.medicalCouncilRegistration && (
            <p className="text-sm text-red-600">
              {errors.medicalCouncilRegistration.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Medical Council State</Label>
          <Input {...register("medicalCouncilState")} />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Primary Address</Label>
          <Textarea {...register("address")} />
        </div>

        <div className="space-y-1.5">
          {/* <Label>
            Country <span className="text-red-600">*</span>
          </Label>
          <Input {...register("country")} />
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country.message}</p>
          )} */}
          <CountryStateCitySelect
            control={control}
            watch={watch}
            errors={errors}
          />
        </div>

        {/* <div className="space-y-1.5">
          <Label>State</Label>
          <Input {...register("state")} />
        </div>

        <div className="space-y-1.5">
          <Label>City</Label>
          <Input {...register("city")} />
        </div> */}

        <div className="space-y-1.5">
          <Label>Pincode</Label>
          <Input {...register("pincode")} />
        </div>

        {/* <div className="space-y-1.5">
          <Label>Meal Preference</Label>
          <Select
            onValueChange={(val) =>
              setValue("mealPreference", val as FormData["mealPreference"])
            }
            defaultValue={basicDetails.mealPreference || ""}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select Meal Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Veg">Veg</SelectItem>
              <SelectItem value="Non-Veg">Non-Veg</SelectItem>
              <SelectItem value="Jain">Jain</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="space-y-1.5">
          <Label>Meal Preference</Label>
          <Controller
            name="mealPreference"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""} // ✅ controlled
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select Meal Preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Veg">Veg</SelectItem>
                  <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                  <SelectItem value="Jain">Jain</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.mealPreference && (
            <p className="text-sm text-red-600">
              {errors.mealPreference.message}
            </p>
          )}
        </div>

        {/* <div className="space-y-1.5">
          <Label>Gender</Label>
          <Select
            onValueChange={(val) =>
              setValue("gender", val as FormData["gender"])
            }
            defaultValue={basicDetails.gender || ""}
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
          {errors.gender && (
            <p className="text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div> */}

        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""} // ✅ controlled
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
            )}
          />
          {errors.gender && (
            <p className="text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
      </div>

      {/* Registration Categories */}
      {/* <div className="space-y-2">
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
              value: "Member",
              label: "Member",
              price: "₹ 15,170.00",
            },
            {
              id: "r2",
              value: "Trade",
              label: "Trade Delegates",
              price: "₹ 14,000.00",
            },
            {
              id: "r3",
              value: "Student",
              label: "Technologists/Students",
              price: "₹ 20,000.00",
            },
            {
              id: "r4",
              value: "Non-Member",
              label: "Non-Member",
              price: "₹ 28,563.00",
            },
          ].map(({ id, value, label, price }) => (
            <div
              key={id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div className="flex items-center gap-2 ">
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
      </div> */}

      <div className="space-y-2">
        <Label className="font-medium">Select Registration Category</Label>
        <RadioGroup
          defaultValue={
            basicDetails.registrationCategory
              ? JSON.stringify(basicDetails.registrationCategory)
              : ""
          }
          onValueChange={(val) =>
            setValue("registrationCategory", JSON.parse(val))
          }
          className="space-y-2"
        >
          {categories.map((cat: RegistrationCategory) => (
            <Label
              key={cat._id}
              htmlFor={cat._id}
              className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={JSON.stringify(cat)} id={cat._id} />
                <span>{cat.categoryName}</span>
              </div>
              <div className="text-right">
                <p>₹ {cat.amount.toLocaleString("en-IN")}.00</p>
              </div>
            </Label>
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
        <Button
          type="submit"
          className="bg-[#00509E] hover:bg-[#003B73] px-8 cursor-pointer"
        >
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
