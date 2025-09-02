"use client";

import { useEffect, useMemo, useState } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { useEventStore } from "@/app/store/useEventStore"; // ✅ import event store
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

      const payload = {
        eventId: basicDetails.eventId,
        eventName: basicDetails.eventName,
        registrationCategory: basicDetails.registrationCategory._id,
        mealPreference: basicDetails.mealPreference,
        prefix: basicDetails.prefix,
        fullName: basicDetails.fullName,
        phone: basicDetails.phone,
        email: basicDetails.email,
        affiliation: basicDetails.affiliation,
        designation: basicDetails.designation,
        medicalCouncilRegistration: basicDetails.medicalCouncilRegistration,
        medicalCouncilState: basicDetails.medicalCouncilState,
        address: basicDetails.address,
        country: basicDetails.country,
        state: basicDetails.state,
        city: basicDetails.city,
        pincode: basicDetails.pincode,
        gender: basicDetails.gender,
      };

      const registrationRes = await fetch("/api/user/registration", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!registrationRes.ok) {
        const err = await registrationRes.json();
        throw new Error(err?.error || "Failed to create registration");
      }

      const { registration } = await registrationRes.json();
      const registrationId = registration._id;

      const orderRes = await fetch("/api/user/payment/order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });

      if (!orderRes.ok) throw new Error("Failed to create payment order");

      const { order } = await orderRes.json();
      if (!(window as any).Razorpay) throw new Error("Razorpay not loaded");

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Event Registration",
        description: registration.eventName,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/user/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                registrationId,
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");
            toast.success("Payment successful!");
            router.push("/registration/success");
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: basicDetails.fullName,
          email: basicDetails.email,
          contact: basicDetails.phone,
        },
        theme: { color: "#00509E" },
      };

      new (window as any).Razorpay(options).open();
    } catch (err: any) {
      toast.error(err.message || "Failed to process registration/payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="p-6 space-y-8">
        {/* Basic Details */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold border-b-2 border-[#00509E] pb-1 text-[#003B73]">
              Basic Details
            </h3>
            <Button
              className="bg-[#00509E] hover:bg-[#003B73] text-white transition-all duration-200 cursor-pointer hover:text-wh"
              size="sm"
              variant="ghost"
              onClick={() => onBack()} // or router.push if you’re routing steps
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
                <p className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <Input
                  value={(tempBasic as any)[key] || ""}
                  onChange={(e) =>
                    setTempBasic({ ...tempBasic, [key]: e.target.value })
                  }
                  disabled={editingSection !== "basic"}
                  className={
                    editingSection === "basic" ? "ring-1 ring-blue-300" : ""
                  }
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h3 className="text-sm font-semibold border-b-2 border-[#00509E] pb-1 text-[#003B73] mb-2">
            Order Summary
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>
                {currentEvent?.eventName
                  ? `${currentEvent.eventName} - ${
                      basicDetails?.registrationCategory?.categoryName ||
                      "Registration"
                    }`
                  : basicDetails?.registrationCategory?.categoryName ||
                    "Registration"}

                {!skippedAccompanying && accompanyingPersons.length > 0 && (
                  <> + 1 Accompanying Person</>
                )}
              </span>

              <span>₹ {regAmount.toLocaleString("en-IN")}.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹ {tax.toLocaleString("en-IN")}.00</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₹ {total.toLocaleString("en-IN")}.00</span>
            </div>
          </div>
        </section>

        {/* Confirm & Pay */}
        <div className="text-center pt-4 z-50">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#00509E] hover:bg-[#003B73] text-white transition-all duration-200 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              "Confirm & Pay"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
