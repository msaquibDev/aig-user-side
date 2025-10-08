"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/app/store/useUserStore";
import { Loader2, Pencil } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import CountryStateCitySelect from "../common/CountryStateCitySelect";

// Updated Profile type to match your data structure
type Profile = {
  photo: string;
  fullName: string;
  prefix: string;
  designation: string;
  affiliation: string;
  medicalCouncilState: string;
  medicalCouncilRegistration: string;
  phone: string;
  email: string;
  country: string;
  gender: string;
  city: string;
  state: string;
  mealPreference: string;
  pincode: string;
};

// ✅ Updated Schema to match your Profile type
const profileSchema = z.object({
  photo: z.string().optional(),
  fullName: z
    .string()
    .min(3, "Full name is required")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
    .max(50, "Maximum 50 characters"),
  prefix: z.string().min(1, "Prefix is required").max(10),
  designation: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters")
    .optional()
    .or(z.literal("")),
  affiliation: z.string().min(1, "Affiliation is required").max(50),
  medicalCouncilState: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters")
    .optional()
    .or(z.literal("")),
  medicalCouncilRegistration: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be 10 digits" }),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  gender: z.string().optional().or(z.literal("")),
  city: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters")
    .optional()
    .or(z.literal("")),
  mealPreference: z.string().optional().or(z.literal("")),
  pincode: z
    .string()
    .regex(/^\d+$/, "Pincode must be numeric")
    .min(4, "Minimum 4 digits")
    .max(10, "Maximum 10 digits")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof profileSchema>;

interface MyProfileFormProps {
  initialData: Profile;
  onProfileUpdate?: (updatedProfile: Profile) => void;
}

export default function MyProfileForm({
  initialData,
  onProfileUpdate,
}: MyProfileFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  // ✅ Setup react-hook-form with proper typing
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...initialData,
    },
  });

  // ✅ Reset when initialData changes
  useEffect(() => {
    reset(initialData);
    setUser({
      photo: initialData.photo,
      fullName: initialData.fullName,
      email: initialData.email,
    });
  }, [initialData, reset, setUser]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setPhotoError("Unsupported file type. Use JPG, JPEG, PNG, GIF, or WEBP.");
      return;
    }
    if (file.size > maxSize) {
      setPhotoError("File size exceeds 5MB. Please choose a smaller file.");
      return;
    }

    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);

    // Update form state
    reset({
      ...watch(),
      photo: previewUrl,
    });

    // Update global user state
    setUser({
      photo: previewUrl,
      fullName: watch("fullName"),
      email: watch("email"),
    });

    setPhotoError("");
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value && key !== "photo") {
          formData.append(key, value.toString());
        }
      });

      // Append profile picture if changed
      if (photoFile) {
        formData.append("profilePicture", photoFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await res.json();

      // Update local state with the response
      const updatedProfile = {
        ...data,
        photo: result.user?.profilePicture || data.photo,
      };

      setUser({
        photo: updatedProfile.photo,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
      });

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile as Profile);
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setPhotoFile(null); // Reset photo file after successful upload
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset(initialData);
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoError("");

    // Reset user state to initial data
    setUser({
      photo: initialData.photo,
      fullName: initialData.fullName,
      email: initialData.email,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-200 shadow-sm rounded-lg p-6"
    >
      {/* Profile Photo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <label htmlFor="photo" className="cursor-pointer block">
            <img
              src={watch("photo") || "/authImg/user.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 hover:opacity-80 transition"
            />
            {isEditing && (
              <span className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition">
                <Pencil className="w-4 h-4 text-[#00509E]" />
              </span>
            )}
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label className="text-[#00509E] font-medium text-lg">
            Profile Photo
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            File size: Up to 5MB • Supported: JPG, JPEG, PNG, GIF, WEBP
          </p>
          {photoError && (
            <p className="text-sm text-red-500 mt-2 font-medium">
              {photoError}
            </p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          control={control}
          name="prefix"
          label="Prefix"
          required
          editing={isEditing}
          error={errors.prefix}
        />
        <InputField
          control={control}
          name="fullName"
          label="Full Name"
          required
          editing={isEditing}
          error={errors.fullName}
        />
        <SelectField
          control={control}
          name="gender"
          label="Gender"
          options={["Male", "Female", "Other"]}
          editing={isEditing}
          error={errors.gender}
        />
        <InputField
          control={control}
          name="designation"
          label="Designation"
          editing={isEditing}
          error={errors.designation}
        />
        <InputField
          control={control}
          name="affiliation"
          label="Affiliation"
          required
          editing={isEditing}
          error={errors.affiliation}
        />
        <InputField
          control={control}
          name="medicalCouncilState"
          label="Medical Council State"
          editing={isEditing}
          error={errors.medicalCouncilState}
        />
        <InputField
          control={control}
          name="medicalCouncilRegistration"
          label="Medical Council Registration"
          editing={isEditing}
          error={errors.medicalCouncilRegistration}
        />
        <SelectField
          control={control}
          name="mealPreference"
          label="Meal Preference"
          options={["Veg", "Non-Veg", "Vegan"]}
          editing={isEditing}
          error={errors.mealPreference}
        />
        <InputField
          control={control}
          name="phone"
          label="Mobile No."
          required
          editing={isEditing}
          error={errors.phone}
        />
        <InputField
          control={control}
          name="email"
          label="Email"
          disabled
          editing={isEditing}
          error={errors.email}
        />

        {/* Country / State / City / Pincode */}
        <div className="sm:col-span-2">
          <CountryStateCitySelect
            control={control}
            watch={watch}
            errors={errors}
            showCountry={true}
            disableCountry={true}
            showState={true}
            showCity={true}
            showPincode={true}
            editing={isEditing}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        {!isEditing ? (
          <Button
            type="button"
            className="px-8 py-2 bg-[#00509E] hover:bg-[#003B73] text-white font-semibold cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              className="px-8 py-2 bg-[#00509E] hover:bg-[#003B73] text-white font-semibold cursor-pointer"
              disabled={loading || !isDirty}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </Button>
            <Button
              type="button"
              className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold cursor-pointer"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

// ---------------------
// Helper Components
// ---------------------

const InputField = ({
  control,
  name,
  label,
  required,
  editing,
  disabled,
  error,
}: {
  control: any;
  name: keyof FormData;
  label: string;
  required?: boolean;
  editing: boolean;
  disabled?: boolean;
  error?: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          id={name}
          disabled={!editing || disabled}
          className={`${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-[#00509E]"
          } transition-colors`}
        />
      )}
    />
    {error && (
      <p className="text-sm text-red-500 font-medium">{error.message}</p>
    )}
  </div>
);

const SelectField = ({
  control,
  name,
  label,
  options,
  editing,
  error,
}: {
  control: any;
  name: keyof FormData;
  label: string;
  options: string[];
  editing: boolean;
  error?: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          value={field.value || ""}
          onValueChange={field.onChange}
          disabled={!editing}
        >
          <SelectTrigger
            id={name}
            className={`w-full cursor-pointer ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-[#00509E]"
            } transition-colors`}
          >
            <SelectValue placeholder="-Select-" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="cursor-pointer"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {error && (
      <p className="text-sm text-red-500 font-medium">{error.message}</p>
    )}
  </div>
);
