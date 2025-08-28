// app/dashboard/profile/page.tsx
import MyProfileForm from "@/components/dashboard/MyProfileForm";
import { Profile } from "@/app/data/profile";
import { cookies } from "next/headers";

async function getProfile(): Promise<Profile | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";
    const res = await fetch(`${baseUrl}/user/profile`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      // Important: Forward cookies to API (if using auth)
      headers: {
        Cookie: cookies().toString(), // if you need to forward session cookies from server
      },
    });
    console.log("Fetch profile response status:", res.status);
    if (!res.ok) return null;
    const data = await res.json();

    return {
      photo: data.profilePicture || "/authImg/user.png",
      fullName: data.fullname || "",
      prefix: data.prefix || "",
      designation: data.designation || "",
      affiliation: data.affiliation || "",
      medicalCouncilState: data.medicalCouncilState || "",
      medicalCouncilRegistration: data.medicalCouncilRegistration || "",
      phone: data.mobile || "",
      email: data.email || "",
      country: data.country || "",
      gender: data.gender || "",
      city: data.city || "",
      state: data.state || "",
      mealPreference: data.mealPreference || "",
      pincode: data.pincode || "",
    };
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

export default async function ProfilePage() {
  const profile = await getProfile();

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
