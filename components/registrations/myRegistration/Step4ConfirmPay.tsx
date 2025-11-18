"use client";

import { useEffect, useMemo, useState } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { useEventStore } from "@/app/store/useEventStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

type Section = "basic" | "accompany" | "workshop" | null;

export default function Step4ConfirmPay({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const { currentEvent } = useEventStore();

  const {
    basicDetails,
    accompanyingPersons,
    selectedWorkshops,
    updateBasicDetails,
    setAccompanyingPersons,
    setSelectedWorkshops,
    skippedAccompanying,
    skippedWorkshops,
  } = useRegistrationStore();

  const [loading, setLoading] = useState(false);
  const [tempBasic, setTempBasic] = useState({ ...basicDetails });
  const [tempAccompany, setTempAccompany] = useState(
    accompanyingPersons[0] || {}
  );
  const [tempWorkshop, setTempWorkshop] = useState([...selectedWorkshops]);
  const [editingSection, setEditingSection] = useState<Section>(null);

  useEffect(() => {
    setTempBasic({ ...basicDetails });
  }, [basicDetails]);

  const initialAccompany = useMemo(
    () => accompanyingPersons[0] || {},
    [accompanyingPersons]
  );

  // Updated to handle slabName instead of categoryName
  const regAmount = basicDetails?.registrationCategory?.amount || 0;
  const tax = Math.round(regAmount * 0.18);
  const total = regAmount + tax;

  const toggleEdit = (section: Section) => {
    const isEditing = editingSection === section;
    if (isEditing) {
      if (section === "basic") updateBasicDetails(tempBasic);
      if (section === "accompany") setAccompanyingPersons([tempAccompany]);
      if (section === "workshop") setSelectedWorkshops(tempWorkshop);
      setEditingSection(null);
    } else {
      if (section === "basic") setTempBasic({ ...basicDetails });
      if (section === "accompany") setTempAccompany({ ...initialAccompany });
      if (section === "workshop") setTempWorkshop([...selectedWorkshops]);
      setEditingSection(section);
    }
  };

  const handleSubmit = async () => {
    if (editingSection === "basic") updateBasicDetails(tempBasic);

    if (
      !basicDetails.eventId ||
      !basicDetails.eventName ||
      !basicDetails.fullName ||
      !basicDetails.email ||
      !basicDetails.phone ||
      !basicDetails.registrationCategory?._id
    ) {
      toast.error("Please complete all required details before submitting.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Updated payload to match backend structure
      const payload = {
        registrationSlabId: basicDetails.registrationCategory?._id, // ✅ Correct field name
        prefix: basicDetails.prefix,
        name: basicDetails.fullName, // ✅ Changed from fullName to name
        gender: basicDetails.gender,
        email: basicDetails.email,
        mobile: basicDetails.phone, // ✅ Changed from phone to mobile
        designation: basicDetails.designation,
        affiliation: basicDetails.affiliation,
        medicalCouncilState: basicDetails.medicalCouncilState,
        medicalCouncilRegistration: basicDetails.medicalCouncilRegistration,
        mealPreference: basicDetails.mealPreference,
        country: basicDetails.country,
        city: basicDetails.city,
        pincode: basicDetails.pincode,
        state: basicDetails.state,
        address: basicDetails.address,
        // Note: pincode is not in backend payload but is in user profile
      };

      const token = localStorage.getItem("accessToken");

      // ✅ Fixed API endpoint - using events route not user route
      const registrationRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${basicDetails.eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!registrationRes.ok) {
        const err = await registrationRes.json();
        throw new Error(err?.message || "Registration failed");
      }

      const registrationData = await registrationRes.json();

      // ✅ Get registration ID from correct response structure
      const registrationId = registrationData.data?._id;

      if (registrationId) {
        // toast.success("Registration submitted successfully!");

        // ✅ Redirect to payment page with registration ID
        router.push(
          `/registration/payment?registrationId=${registrationId}&eventId=${basicDetails.eventId}`
        );
      } else {
        throw new Error("No registration ID received");
      }
    } catch (error) {
      console.error("Registration Error:", error);

      // ✅ Handle duplicate registration error
      if (
        error instanceof Error &&
        error.message.includes("already registered")
      ) {
        toast.error("You are already registered for this event");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Basic Details */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#00509E] border-b-2 border-[#00509E] pb-1">
              Basic Details
            </h3>
            <Button
              className="bg-[#00509E] hover:bg-[#003B73] text-white transition-all duration-200 cursor-pointer"
              size="sm"
              onClick={() => onBack()}
            >
              ✎ Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              "prefix",
              "fullName",
              "phone",
              "email",
              "affiliation",
              "designation",
              "medicalCouncilRegistration",
              "medicalCouncilState",
              "address",
              "country",
              "state",
              "city",
              "pincode",
              "mealPreference",
              "gender",
            ].map((key) => (
              <div
                key={key}
                className={key === "address" ? "sm:col-span-2" : ""}
              >
                <p className="text-gray-600 capitalize font-medium mb-1">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <Input
                  value={(tempBasic as any)[key] || ""}
                  onChange={(e) =>
                    setTempBasic({ ...tempBasic, [key]: e.target.value })
                  }
                  disabled={editingSection !== "basic"}
                  className={
                    editingSection === "basic"
                      ? "ring-1 ring-blue-300 bg-blue-50"
                      : "bg-gray-50"
                  }
                  autoComplete="off"
                />
              </div>
            ))}

            {/* Registration Category Display */}
            <div className="sm:col-span-2">
              <p className="text-gray-600 font-medium mb-1">
                Registration Category
              </p>
              <Input
                value={
                  tempBasic.registrationCategory?.slabName || "Not selected"
                }
                disabled
                className="bg-gray-50 font-semibold"
              />
            </div>

            {/* Registration Amount Display */}
            <div>
              <p className="text-gray-600 font-medium mb-1">Registration Fee</p>
              <Input
                value={`₹ ${(
                  tempBasic.registrationCategory?.amount || 0
                ).toLocaleString("en-IN")}.00`}
                disabled
                className="bg-gray-50 font-semibold text-green-600"
              />
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#00509E] border-b-2 border-[#00509E] pb-1 mb-4">
            Order Summary
          </h3>
          <div className="text-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {currentEvent?.eventName
                  ? `${currentEvent.eventName} - ${
                      basicDetails?.registrationCategory?.slabName ||
                      "Registration"
                    }`
                  : basicDetails?.registrationCategory?.slabName ||
                    "Registration"}

                {!skippedAccompanying && accompanyingPersons.length > 0 && (
                  <span className="text-gray-500 text-xs ml-2">
                    + {accompanyingPersons.length} accompanying person(s)
                  </span>
                )}
              </span>
              <span className="font-semibold">
                ₹ {regAmount.toLocaleString("en-IN")}.00
              </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between items-center font-semibold text-base">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-green-600">
                ₹ {regAmount.toLocaleString("en-IN")}.00
              </span>
            </div>
          </div>
        </section>

        {/* Confirm & Pay */}
        <div className="text-center pt-6">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#00509E] hover:bg-[#003B73] text-white transition-all duration-200 px-8 py-3 text-lg min-w-40 cursor-pointer"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Confirm & Pay"
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            You will be redirected to secure payment page
          </p>
        </div>
      </div>
    </div>
  );
}
