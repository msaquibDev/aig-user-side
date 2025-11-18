// components/registrations/myRegistration/Step1BasicDetails.tsx
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
import { useEventStore } from "@/app/store/useEventStore";
import { medicalCouncils } from "@/app/data/medicalCouncils";
import { formatSlabValidity } from "@/app/utils/formatEventDate";

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
  mealPreference: z.string().min(1, "Please select a meal preference"),
  // add near the end of your schema object
  acceptedTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms and conditions",
  }),

  registrationCategory: z.object({
    _id: z.string(),
    slabName: z.string(), // ✅ Changed from categoryName to slabName
    amount: z.number(),
  }),
});

type FormData = z.infer<typeof schema>;

type MealPreference = {
  _id: string;
  eventId: string;
  mealName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default function Step1BasicDetails({ onNext }: { onNext: () => void }) {
  const { basicDetails, updateBasicDetails } = useRegistrationStore();
  const { currentEvent } = useEventStore(); // Get current event from store
  const [categories, setCategories] = useState([]);
  const [mealPreferences, setMealPreferences] = useState<MealPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [terms, setTerms] = useState<any[]>([]);
  const [termsLoading, setTermsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

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

  // Fetch meal preferences based on event ID
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

      if (data.success && Array.isArray(data.data)) {
        setMealPreferences(data.data);
      } else {
        console.error("Failed to fetch meal preferences:", data);
        toast.error("Failed to load meal preferences");
        // Fallback to default options if API fails
        setMealPreferences([
          {
            _id: "1",
            mealName: "Vegetarian",
            status: "Active",
          } as MealPreference,
          {
            _id: "2",
            mealName: "Non-Vegetarian",
            status: "Active",
          } as MealPreference,
          { _id: "3", mealName: "Vegan", status: "Active" } as MealPreference,
        ]);
      }
    } catch (err) {
      console.error("GET meal preferences error:", err);
      toast.error("Error loading meal preferences");
      // Fallback to default options
      setMealPreferences([
        {
          _id: "1",
          mealName: "Vegetarian",
          status: "Active",
        } as MealPreference,
        {
          _id: "2",
          mealName: "Non-Vegetarian",
          status: "Active",
        } as MealPreference,
        { _id: "3", mealName: "Vegan", status: "Active" } as MealPreference,
      ]);
    } finally {
      setLoadingMeals(false);
    }
  };

  const fetchTerms = async (eventId: string) => {
    try {
      setTermsLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/terms-and-conditions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) {
        // treat 404 / not-found as empty list
        setTerms([]);
        return;
      }

      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setTerms(data.data);
      } else {
        setTerms([]);
      }
    } catch (err) {
      console.error("GET terms error:", err);
      setTerms([]);
    } finally {
      setTermsLoading(false);
    }
  };

  // Fetch registration slabs based on event ID
  useEffect(() => {
    async function fetchRegistrationSlabs() {
      if (!currentEvent?._id) {
        return;
      }

      try {
        setLoading(true);

        // Fetch meal preferences first
        await fetchMealPreferences(currentEvent._id);

        // Then fetch registration slabs
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${currentEvent._id}/slabs/active`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // Transform the data to match your existing structure
          const transformedCategories = data.data.map((slab: any) => ({
            _id: slab._id,
            slabName: slab.slabName, // Using slabName instead of categoryName
            amount: slab.amount,
            // Add any additional fields you need
            startDate: slab.startDate,
            endDate: slab.endDate,
          }));

          setCategories(transformedCategories);
          fetchTerms(currentEvent._id);
        } else {
          console.error("Invalid response format:", data);
          toast.error("Failed to load registration options");
        }
      } catch (err) {
        console.error("GET registration slabs error:", err);
        toast.error("Error loading registration options");
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrationSlabs();
  }, [currentEvent?._id]); // Re-fetch when event ID changes

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
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
              <Select onValueChange={field.onChange} value={field.value || ""}>
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
            maxLength={10}
            {...register("phone")}
            onInput={(e) => {
              let val = e.currentTarget.value.replace(/\D/g, "");
              if (val.length > 10) val = val.slice(0, 10);
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

        {/* ✅ Updated Meal Preference Section */}
        <div className="space-y-1.5">
          <Label>
            Meal Preference <span className="text-red-600">*</span>
          </Label>
          <Controller
            name="mealPreference"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={loadingMeals}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue
                    placeholder={
                      loadingMeals
                        ? "Loading meal preferences..."
                        : "Select Meal Preference"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {mealPreferences.length > 0 ? (
                    mealPreferences.map((meal) => (
                      <SelectItem key={meal._id} value={meal.mealName}>
                        {meal.mealName}
                      </SelectItem>
                    ))
                  ) : (
                    // Fallback options if no meal preferences are loaded
                    <>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Non-Vegetarian">
                        Non-Vegetarian
                      </SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mealPreference && (
            <p className="text-sm text-red-600">
              {errors.mealPreference.message}
            </p>
          )}
          {loadingMeals && (
            <p className="text-sm text-blue-600">Loading meal preferences...</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Medical Council State <span className="text-red-600">*</span>
          </Label>

          {!basicDetails.medicalCouncilState ||
          basicDetails.medicalCouncilState.trim() === "" ? (
            // ✅ Show dropdown if no prefilled value
            <Controller
              name="medicalCouncilState"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Select Medical Council" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalCouncils.map((council) => (
                      <SelectItem key={council} value={council}>
                        {council}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            // ✅ Show text input if profile already has a council value
            <Input {...register("medicalCouncilState")} />
          )}

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
            disableCountry={true}
            showState={true}
            showCity={true}
            showPincode={true}
            editing={true}
          />
        </div>
      </div>

      {/* Registration Category Section */}
      <div className="space-y-2">
        <Label className="font-medium">
          Select Registration Category <span className="text-red-600">*</span>
        </Label>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00509E] mx-auto mb-2"></div>
              <p className="text-gray-600">Loading registration options...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">
              No registration options available for this event.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Please contact event organizers.
            </p>
          </div>
        ) : (
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
            {categories.map((cat: any) => (
              <Label
                key={cat._id}
                htmlFor={cat._id}
                className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={JSON.stringify(cat)} id={cat._id} />
                  <div>
                    <span className="font-medium">{cat.slabName}</span>
                    {cat.startDate && cat.endDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatSlabValidity(cat.startDate, cat.endDate)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ₹ {cat.amount.toLocaleString("en-IN")}.00
                  </p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        )}
        {errors.registrationCategory && (
          <p className="text-sm text-red-600">
            {errors.registrationCategory.message}
          </p>
        )}
      </div>

      {/* Terms & Conditions - Compact Version */}
      <div className="mt-6">
        <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
          <Controller
            name="acceptedTerms"
            control={control}
            render={({ field }) => (
              <label className="flex items-start gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-[#00509E] border-gray-300 rounded focus:ring-[#00509E]"
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-900">
                    I accept the{" "}
                    <a
                      href={
                        currentEvent?._id
                          ? `/events/${currentEvent._id}/terms`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00509E] hover:text-[#003B73] font-medium underline transition-colors"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and Cancellation Policy
                  </span>
                </div>
              </label>
            )}
          />
        </div>

        {/* Validation Error */}
        {errors.acceptedTerms && (
          <p className="text-sm text-red-600">{errors.acceptedTerms.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="text-center">
        <Button
          type="submit"
          className="bg-[#00509E] hover:bg-[#003B73] px-8 cursor-pointer"
          disabled={loading || categories.length === 0 || loadingMeals}
        >
          {loading || loadingMeals ? "Loading..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}
