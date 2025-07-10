// /app/dashboard/profile/page.tsx
import { getDummyProfile } from "@/app/data/profile";
import MyProfileForm from "@/app/components/dashboard/MyProfileForm";

export default function ProfilePage() {
  const profile = getDummyProfile();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">My Profile</h1>
      <MyProfileForm initialData={profile} />
    </div>
  );
}
