"use client";

import { useState } from "react";
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
import { Profile } from "@/app/data/profile";

export default function MyProfileForm({
  initialData,
}: {
  initialData: Profile;
}) {
  const [formData, setFormData] = useState(initialData);
  const [photoError, setPhotoError] = useState("");

  const handleChange = (field: keyof Profile, value: string) => {
    setFormData({ ...formData, [field]: value });
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
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setPhotoError("Unsupported file type. Use JPG, JPEG, PNG, GIF, or WEBP.");
      return;
    }

    if (file.size > maxSize) {
      setPhotoError("File size exceeds 5MB. Please choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      setPhotoError("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-md p-6">
      {/* Profile Photo */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={formData.photo || "/default-avatar.png"}
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
            File size: Up to 5MB <br />
            Supported file types: JPG, JPEG, PNG, GIF, WEBP
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
        />
        <SelectField
          label="Country"
          value={formData.country}
          onChange={(val) => handleChange("country", val)}
          options={["India", "USA", "UK", "Australia"]}
        />
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(val) => handleChange("gender", val)}
          options={["Male", "Female", "Other"]}
        />
        <SelectField
          label="City"
          value={formData.city}
          onChange={(val) => handleChange("city", val)}
          options={["Hyderabad", "Mumbai", "Delhi", "Chennai"]}
        />
        <SelectField
          label="State"
          value={formData.state}
          onChange={(val) => handleChange("state", val)}
          options={["Telangana", "Maharashtra", "Delhi", "Tamil Nadu"]}
        />
        <SelectField
          label="Meal Preference"
          value={formData.mealPreference}
          onChange={(val) => handleChange("mealPreference", val)}
          options={["Veg", "Non-Veg", "Vegan"]}
        />
        <SelectField
          label="Pincode"
          value={formData.pincode}
          onChange={(val) => handleChange("pincode", val)}
          options={["500001", "110001", "600001"]}
        />
      </div>

      {/* Submit */}
      <div className="mt-10 flex justify-center">
        <Button className="bg-[#00509E] hover:bg-[#003B73] text-white">
          Update
        </Button>
      </div>
    </div>
  );
}

// ------------------------
// Helper Input Component
// ------------------------
const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

// ------------------------
// Helper Select Component
// ------------------------
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
