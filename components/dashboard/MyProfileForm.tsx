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
import { Profile } from "@/app/data/profile";

export default function MyProfileForm({
  initialData,
}: {
  initialData: Profile;
}) {
  const [formData, setFormData] = useState<Profile>(initialData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Ensure all fields are populated when `initialData` changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        photo: initialData.photo || "/authImg/user.png",
        fullName: initialData.fullName || "",
        prefix: initialData.prefix || "",
        designation: initialData.designation || "",
        affiliation: initialData.affiliation || "",
        councilState: initialData.councilState || "",
        councilReg: initialData.councilReg || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        country: initialData.country || "",
        gender: initialData.gender || "",
        city: initialData.city || "",
        state: initialData.state || "",
        mealPreference: initialData.mealPreference || "",
        pincode: initialData.pincode || "",
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof Profile, value: string) => {
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
    setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
    setPhotoError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      toast.success("Profile updated successfully!");
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
        <img
          src={formData.photo || "/authImg/user.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border border-gray-300 cursor-pointer"
        />
        <div>
          <Label
            htmlFor="photo"
            className="text-[#00509E] font-medium cursor-pointer"
          >
            Select Photo
          </Label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <p className="text-xs text-gray-500">
            File size: Up to 5MB <br /> Supported: JPG, JPEG, PNG, GIF, WEBP
          </p>
          {photoError && (
            <p className="text-sm text-red-500 mt-1">{photoError}</p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [&>div]:space-y-2">
        <InputField
          label="Full Name"
          value={formData.fullName}
          onChange={(v) => handleChange("fullName", v)}
        />
        <InputField
          label="Prefix"
          value={formData.prefix}
          onChange={(v) => handleChange("prefix", v)}
        />
        <InputField
          label="Designation"
          value={formData.designation}
          onChange={(v) => handleChange("designation", v)}
        />
        <InputField
          label="Affiliation"
          value={formData.affiliation}
          onChange={(v) => handleChange("affiliation", v)}
        />
        <InputField
          label="Medical Council State"
          value={formData.councilState}
          onChange={(v) => handleChange("councilState", v)}
        />
        <InputField
          label="Medical Council Registration"
          value={formData.councilReg}
          onChange={(v) => handleChange("councilReg", v)}
        />
        <InputField
          label="Mobile No."
          value={formData.phone}
          onChange={(v) => handleChange("phone", v)}
        />
        <InputField
          label="Email"
          value={formData.email}
          onChange={(v) => handleChange("email", v)}
          disabled
        />
        <InputField
          label="Country"
          value={formData.country}
          onChange={(val) => handleChange("country", val)}
          // options={["India", "USA", "UK", "Australia"]}
        />
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(val) => handleChange("gender", val)}
          options={["Male", "Female", "Other"]}
        />
        <InputField
          label="City"
          value={formData.city}
          onChange={(val) => handleChange("city", val)}
          // options={["Hyderabad", "Mumbai", "Delhi", "Chennai"]}
        />
        <InputField
          label="State"
          value={formData.state}
          onChange={(val) => handleChange("state", val)}
          // options={["Telangana", "Maharashtra", "Delhi", "Tamil Nadu"]}
        />
        <SelectField
          label="Meal Preference"
          value={formData.mealPreference}
          onChange={(val) => handleChange("mealPreference", val)}
          options={["Veg", "Non-Veg", "Vegan"]}
        />
        <InputField
          label="Pincode"
          value={formData.pincode}
          onChange={(v) => handleChange("pincode", v)}
        />
      </div>

      {/* Submit */}
      <div className="mt-10 flex justify-center">
        <Button
          type="submit"
          className="bg-[#00509E] hover:bg-[#003B73] text-white"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}

const InputField = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => (
  <div>
    <Label>{label}</Label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <div>
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
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
  </div>
);
