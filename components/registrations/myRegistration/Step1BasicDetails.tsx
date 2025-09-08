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
  designation: z.string().min(1, "Designation is required"),
  medicalCouncilRegistration: z.string().min(1, "Registration is required"),
  medicalCouncilState: z.string().min(1, "Medical Council State is required"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(1, "Pincode is required"),

  gender: z.string().min(1, "Gender is required"),

  // mealPreference: z.enum(["Veg", "Non-Veg", "Jain"], {
  //   required_error: "Meal preference is required",
  // }),

  // mealPreference: z.string().min(1, "Meal preference is required"),
  mealPreference: z.object({
    _id: z.string(),
    mealName: z.string()
    
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
  const [mealPreferences, setMealPreferences] = useState<any[]>([]);

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

  useEffect(() => {
    async function fetchMealPreferences() {
      try {
        const res = await fetch("/api/user/mealPreference", { method: "GET" });
        const data = await res.json();
        console.log("Meal Preference Response:", data);
        if (data.success) {
          setMealPreferences(data.data); // [{_id, mealName}, ...]
        }
      } catch (err) {
        console.error("GET meal preferences error:", err);
      }
    }

    fetchMealPreferences();
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
            Gender <span className="text-red-600">*</span>
          </Label>
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
            Affiliation <span className="text-red-600">*</span>
          </Label>
          <Input {...register("affiliation")} />
          {errors.affiliation && (
            <p className="text-sm text-red-600">{errors.affiliation.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Designation <span className="text-red-600">*</span>
          </Label>
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
          <Label>
            Meal Preference <span className="text-red-600">*</span>
          </Label>
          <Controller
            name="mealPreference"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  const selected = mealPreferences.find((m) => m._id === value);
                  if (selected) {
                    field.onChange({
                      _id: selected._id, // ✅ for backend
                      mealName: selected.mealName, // ✅ for UI/review
                    });
                  }
                }}
                value={field.value?._id || ""} // keep controlled
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select Meal Preference" />
                </SelectTrigger>
                <SelectContent>
                  {mealPreferences.map((meal) => (
                    <SelectItem key={meal._id} value={meal._id}>
                      {meal.mealName}
                    </SelectItem>
                  ))}
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

        <div className="space-y-1.5">
          <Label>
            Medical Council State <span className="text-red-600">*</span>
          </Label>
          <Input {...register("medicalCouncilState")} />
          {errors.medicalCouncilState && (
            <p className="text-sm text-red-600">
              {errors.medicalCouncilState.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>
            Primary Address <span className="text-red-600">*</span>
          </Label>
          <Textarea {...register("address")} />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
          <CountryStateCitySelect
            control={control}
            watch={watch}
            errors={errors}
            showCountry={true}
            disableCountry={true} // ✅ allow country change
            showState={true}
            showCity={true}
            showPincode={true}
            editing={true} // ✅ allow state/city/pincode change
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-medium">
          Select Registration Category <span className="text-red-600">*</span>
        </Label>
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
