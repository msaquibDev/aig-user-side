"use client";

import { useEffect, useState } from "react";
import MyProfileForm from "@/components/dashboard/MyProfileForm";
import { Profile } from "@/app/data/profile";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include",
        });
        console.log("Fetching profile data...");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        console.log("Profile data fetched:", data);
        setProfile({
          photo: data.profilePicture || "/authImg/user.png",
          fullName: data.fullname || "",
          prefix: data.prefix || "",
          designation: data.designation || "",
          affiliation: data.affiliation || "",
          councilState: data.medicalCouncilState || "",
          councilReg: data.councilReg || "",
          phone: data.mobile || "",
          email: data.email || "",
          country: data.country || "",
          gender: data.gender || "",
          city: data.city || "",
          state: data.state || "",
          mealPreference: data.mealPreference || "",
          pincode: data.pincode || "",
        });
      } catch (error) {
        toast.error("Error loading profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!profile) {
    return <p className="p-4 text-red-500">No profile data found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">My Profile</h1>
      <MyProfileForm initialData={profile} />
    </div>
  );
}
