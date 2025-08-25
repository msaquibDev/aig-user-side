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
import { Profile } from "@/app/data/profile";
import { useUserStore } from "@/app/store/useUserStore";
import { useSession } from "next-auth/react";
import { Loader2, Pencil } from "lucide-react";

/**
 * Zod validation schema (matches the rules you provided)
 */
const profileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name is required")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed")
    .max(50, "Maximum 50 characters"),
  prefix: z
    .string()
    .min(1, "Prefix is required")
    .max(10, "Maximum 10 characters"),
  designation: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters")
    .optional()
    .or(z.literal("")),
  affiliation: z
    .string()
    .min(1, "Affiliation is required")
    .max(50, "Maximum 100 characters"),
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
  email: z.string().email(),
  country: z.string().min(1, "Country is required"),
  gender: z.string().optional(),
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
  mealPreference: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d+$/, "Pincode must be numeric")
    .min(4, "Minimum 4 digits")
    .max(10, "Maximum 10 digits")
    .optional()
    .or(z.literal("")),
  photo: z.string().optional(),
});

export default function MyProfileForm({
  initialData,
}: {
  initialData: Profile;
}) {
  const [formData, setFormData] = useState<Profile>(initialData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { update } = useSession();

  // stores validation error messages keyed by field name
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setUser = useUserStore((state) => state.setUser);

  // Ensure all fields are populated when `initialData` changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        photo: initialData.photo || "/authImg/user.png",
        fullName: initialData.fullName || "",
        prefix: initialData.prefix || "",
        designation: initialData.designation || "",
        affiliation: initialData.affiliation || "",
        medicalCouncilState: initialData.medicalCouncilState || "",
        medicalCouncilRegistration:
          initialData.medicalCouncilRegistration || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        country: initialData.country || "",
        gender: initialData.gender || "",
        city: initialData.city || "",
        state: initialData.state || "",
        mealPreference: initialData.mealPreference || "",
        pincode: initialData.pincode || "",
      });
      // update navbar store on initial load
      setUser({ photo: initialData.photo, fullName: initialData.fullName });
    }
  }, [initialData, setUser]);

  const handleChange = (field: keyof Profile, value: string) => {
    // clear related validation error as user types
    setErrors((prev) => {
      if (prev[field]) {
        const cp = { ...prev };
        delete cp[field];
        return cp;
      }
      return prev;
    });

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    setFormData((prev) => ({ ...prev, photo: previewUrl }));
    setUser({ photo: previewUrl }); // Update store immediately for live preview
    setPhotoError("");
    // clear photo-level validation error if any
    setErrors((prev) => {
      const cp = { ...prev };
      delete cp["photo"];
      return cp;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod before submitting
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      // Map Zod errors to an object keyed by field name
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = String(err.path[0] || "form");
        // Only set the first message per field
        if (!newErrors[key]) newErrors[key] = err.message;
      });
      setErrors(newErrors);

      // show first error as toast for quick feedback
      const firstMessage = result.error.errors[0]?.message;
      toast.error(firstMessage || "Please fix the form errors");
      return;
    }

    // no validation errors -> proceed
    setErrors({});
    setLoading(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataObj.append(key, value.toString());
      });

      if (photoFile) {
        formDataObj.append("profilePicture", photoFile);
      }

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
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 shadow-sm rounded-md p-6"
    >
      {/* Profile Photo */}
      <div className="flex items-center gap-4 mb-6">
        {/* Profile photo with clickable image */}
        <div className="relative">
          <label htmlFor="photo" className="cursor-pointer">
            <img
              src={formData.photo || "/authImg/user.png"}
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
            <p className="text-sm text-red-500 mt-1">{errors.photo}</p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>div]:space-y-2">
        <InputField
          label="Prefix"
          requiredIndicator={
            <span>
              (Mr/Ms/Dr/Prof)<span className="text-red-500">*</span>
            </span>
          }
          value={formData.prefix}
          onChange={(v) => handleChange("prefix", v)}
          error={errors.prefix}
          disabled={!isEditing}
        />
        <InputField
          label="Full Name"
          requiredIndicator={<span className="text-red-500"> *</span>}
          value={formData.fullName}
          onChange={(v) => handleChange("fullName", v)}
          error={errors.fullName}
          disabled={!isEditing}
        />
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(val) => handleChange("gender", val)}
          options={["Male", "Female", "Other"]}
          error={errors.gender}
          disabled={!isEditing}
        />
        <InputField
          label="Designation"
          value={formData.designation}
          onChange={(v) => handleChange("designation", v)}
          error={errors.designation}
          disabled={!isEditing}
        />
        <InputField
          label="Affiliation"
          requiredIndicator={<span className="text-red-500">*</span>}
          value={formData.affiliation}
          onChange={(v) => handleChange("affiliation", v)}
          error={errors.affiliation}
          disabled={!isEditing}
        />
        <InputField
          label="Medical Council State"
          value={formData.medicalCouncilState}
          onChange={(v) => handleChange("medicalCouncilState", v)}
          error={errors.medicalCouncilState}
          disabled={!isEditing}
        />
        <InputField
          label="Medical Council Registration"
          value={formData.medicalCouncilRegistration}
          onChange={(v) => handleChange("medicalCouncilRegistration", v)}
          error={errors.medicalCouncilRegistration}
          disabled={!isEditing}
        />
        <SelectField
          label="Meal Preference"
          value={formData.mealPreference}
          onChange={(val) => handleChange("mealPreference", val)}
          options={["Veg", "Non-Veg", "Vegan"]}
          error={errors.mealPreference}
          disabled={!isEditing}
        />
        <InputField
          label="Mobile No."
          requiredIndicator={<span className="text-red-500">*</span>}
          value={formData.phone}
          onChange={(v) => handleChange("phone", v)}
          error={errors.phone}
          disabled={!isEditing}
        />
        <InputField
          label="Email"
          value={formData.email}
          onChange={(v) => handleChange("email", v)}
          disabled
          error={errors.email}
        />
        <InputField
          label="Country"
          requiredIndicator={<span className="text-red-500">*</span>}
          value={formData.country}
          onChange={(val) => handleChange("country", val)}
          error={errors.country}
          disabled={!isEditing}
        />
        <InputField
          label="State"
          value={formData.state}
          onChange={(val) => handleChange("state", val)}
          error={errors.state}
          disabled={!isEditing}
        />
        <InputField
          label="City"
          value={formData.city}
          onChange={(val) => handleChange("city", val)}
          error={errors.city}
          disabled={!isEditing}
        />
        <InputField
          label="Pincode"
          value={formData.pincode}
          onChange={(v) => handleChange("pincode", v)}
          error={errors.pincode}
          disabled={!isEditing}
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
                setFormData(initialData); // reset changes
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

const InputField = ({
  label,
  requiredIndicator,
  value,
  onChange,
  disabled,
  error,
}: {
  label: string;
  requiredIndicator?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: string;
}) => (
  <div>
    <Label>
      {label}
      {requiredIndicator}
    </Label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  error,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  disabled?: boolean; // 👈 ADD
}) => (
  <div>
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full cursor-pointer" disabled={disabled}>
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
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);
