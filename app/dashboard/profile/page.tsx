"use client";

import { useEffect, useState } from "react";
import MyProfileForm from "@/components/dashboard/MyProfileForm";
import { Profile } from "@/app/data/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();

        setProfile({
          photo: data.profilePicture || data.photo || "/authImg/user.png",
          fullName: data.fullname || data.name || "",
          prefix: data.prefix || "",
          designation: data.designation || "",
          affiliation: data.affiliation || "",
          medicalCouncilState: data.medicalCouncilState || "",
          medicalCouncilRegistration: data.medicalCouncilRegistration || "",
          phone: data.mobile || data.phone || "",
          email: data.email || "",
          country: data.country || "",
          gender: data.gender || "",
          city: data.city || "",
          state: data.state || "",
          mealPreference: data.mealPreference || "",
          pincode: data.pincode || "",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error loading profile";
        setError(errorMessage);
        toast.error(errorMessage);

        if (
          errorMessage.includes("Session expired") ||
          errorMessage.includes("No authentication token")
        ) {
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#00509E]" />
        <span className="text-gray-600 font-medium">
          Loading your profile...
        </span>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-yellow-700 font-medium">No profile data found.</p>
          <p className="text-yellow-600 text-sm mt-1">
            Please complete your profile setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00509E] mb-2">
          My Profile
        </h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      <MyProfileForm
        initialData={profile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
