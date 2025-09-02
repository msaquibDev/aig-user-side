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

// Ensure Profile type matches Zod schema: optional fields should be string (not string | undefined)
type Profile = {
  prefix: string;
  email: string;
  fullName: string;
  affiliation: string;
  phone: string;
  country: string;
  designation?: string;
  medicalCouncilState?: string;
  medicalCouncilRegistration?: string;
  gender?: string;
  city?: string;
  state?: string;
  mealPreference?: string;
  pincode?: string;
  photo?: string;
};
import { useUserStore } from "@/app/store/useUserStore";
import { useSession } from "next-auth/react";
import { Loader2, Pencil } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import CountryStateCitySelect from "../common/CountryStateCitySelect";

// ✅ Schema stays same
const profileSchema = z.object({
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
    .min(2)
    .max(50)
    .optional()
    .or(z.literal("")),
  medicalCouncilRegistration: z
    .string()
    .min(3)
    .max(50)
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be 10 digits" }),
  email: z.string().email(),
  country: z.string().min(1, "Country is required"),
  gender: z.string().optional(),
  city: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .min(2)
    .max(50)
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .min(2)
    .max(50)
    .optional()
    .or(z.literal("")),
  mealPreference: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d+$/, "Pincode must be numeric")
    .min(4)
    .max(10)
    .optional()
    .or(z.literal("")),
  photo: z.string().optional(),
});

export default function MyProfileForm({
  initialData,
}: {
  initialData: Profile;
}) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { update } = useSession();
  const setUser = useUserStore((state) => state.setUser);

  // ✅ Setup react-hook-form
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...initialData,
      photo: initialData.photo || "/authImg/user.png",
    },
  });

  // ✅ Reset when initialData changes
  useEffect(() => {
    reset({
      ...initialData,
      photo: initialData.photo || "/authImg/user.png",
    });
    setUser({ photo: initialData.photo, fullName: initialData.fullName });
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
    reset((prev) => ({ ...prev, photo: previewUrl })); // update form preview
    setUser({ photo: previewUrl });
    setPhotoError("");
  };

  const onSubmit = async (data: Profile) => {
    setLoading(true);
    try {
      const formDataObj = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formDataObj.append(key, value.toString());
      });
      if (photoFile) formDataObj.append("profilePicture", photoFile);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formDataObj,
      });
      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setUser({ photo: updatedUser.photo, fullName: updatedUser.fullName });

      await update({
        image: updatedUser.photo,
        name: updatedUser.fullName,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-200 shadow-sm rounded-md p-6"
    >
      {/* Profile Photo */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <label htmlFor="photo" className="cursor-pointer">
            <img
              src={watch("photo") || "/authImg/user.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border border-gray-300 hover:opacity-80 transition"
            />
            {isEditing && (
              <span className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100">
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
          <Label className="text-[#00509E] font-medium">Profile Photo</Label>
          <p className="text-xs text-gray-500">
            File size: Up to 5MB <br /> Supported: JPG, JPEG, PNG, GIF, WEBP
          </p>
          {photoError && (
            <p className="text-sm text-red-500 mt-1">{photoError}</p>
          )}
          {errors.photo && (
            <p className="text-sm text-red-500 mt-1">{errors.photo.message}</p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>div]:space-y-2">
        <InputField
          control={control}
          name="prefix"
          label="Prefix"
          required
          editing={isEditing}
        />
        <InputField
          control={control}
          name="fullName"
          label="Full Name"
          required
          editing={isEditing}
        />
        <SelectField
          control={control}
          name="gender"
          label="Gender"
          options={["Male", "Female", "Other"]}
          editing={isEditing}
        />
        <InputField
          control={control}
          name="designation"
          label="Designation"
          editing={isEditing}
        />
        <InputField
          control={control}
          name="affiliation"
          label="Affiliation"
          required
          editing={isEditing}
        />
        <InputField
          control={control}
          name="medicalCouncilState"
          label="Medical Council State"
          editing={isEditing}
        />
        <InputField
          control={control}
          name="medicalCouncilRegistration"
          label="Medical Council Registration"
          editing={isEditing}
        />
        <SelectField
          control={control}
          name="mealPreference"
          label="Meal Preference"
          options={["Veg", "Non-Veg", "Vegan"]}
          editing={isEditing}
        />
        <InputField
          control={control}
          name="phone"
          label="Mobile No."
          required
          editing={isEditing}
        />
        <InputField
          control={control}
          name="email"
          label="Email"
          disabled
          editing={isEditing}
        />

        {/* Country / State / City / Pincode */}
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

      {/* Submit */}
      <div className="mt-10 flex justify-center gap-4">
        {!isEditing ? (
          <button
            type="button"
            className="p-2 h-10 w-20 cursor-pointer rounded-md bg-[#00509E] hover:bg-[#003B73] text-white font-semibold"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <>
            <Button
              type="submit"
              className="bg-[#00509E] hover:bg-[#003B73] text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                "Update"
              )}
            </Button>
            <Button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-black cursor-pointer"
              onClick={() => {
                reset(initialData);
                setIsEditing(false);
              }}
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
// Helpers
// ---------------------

const InputField = ({
  control,
  name,
  label,
  required,
  editing,
  disabled,
}: {
  control: any;
  name: string;
  label: string;
  required?: boolean;
  editing: boolean;
  disabled?: boolean;
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <div>
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input {...field} disabled={!editing || disabled} />
        {fieldState.error && (
          <p className="text-sm text-red-500 mt-1">
            {fieldState.error.message}
          </p>
        )}
      </div>
    )}
  />
);

const SelectField = ({
  control,
  name,
  label,
  options,
  editing,
}: {
  control: any;
  name: string;
  label: string;
  options: string[];
  editing: boolean;
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <div>
        <Label>{label}</Label>
        <Select
          value={field.value || ""}
          onValueChange={field.onChange}
          disabled={!editing}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="-Select-" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldState.error && (
          <p className="text-sm text-red-500 mt-1">
            {fieldState.error.message}
          </p>
        )}
      </div>
    )}
  />
);
