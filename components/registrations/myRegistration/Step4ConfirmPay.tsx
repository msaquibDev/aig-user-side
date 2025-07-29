"use client";

import { useMemo, useState } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const workshopMap: Record<string, { title: string; date: string }> = {
  ws1: {
    title: "Lorem ipsum dolor sit amet consectetur.",
    date: "31 May 2025",
  },
  ws2: {
    title: "Lorem ipsum dolor sit amet consectetur.",
    date: "3 June 2025",
  },
};

type Section = "basic" | "accompany" | "workshop" | null;

export default function Step4ConfirmPay({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

  const initialAccompany = useMemo(
    () => accompanyingPersons[0] || {},
    [accompanyingPersons]
  );

  const [editingSection, setEditingSection] = useState<Section>(null);
  const [tempBasic, setTempBasic] = useState({ ...basicDetails });
  const [tempAccompany, setTempAccompany] = useState({ ...initialAccompany });
  const [tempWorkshop, setTempWorkshop] = useState([...selectedWorkshops]);

  const toggleEdit = (section: Section) => {
    const isEditing = editingSection === section;

    if (isEditing) {
      // Save values
      if (section === "basic") updateBasicDetails(tempBasic);
      if (section === "accompany") setAccompanyingPersons([tempAccompany]);
      if (section === "workshop") setSelectedWorkshops(tempWorkshop);
      setEditingSection(null);
    } else {
      // Reset temp values from store
      if (section === "basic") setTempBasic({ ...basicDetails });
      if (section === "accompany") setTempAccompany({ ...initialAccompany });
      if (section === "workshop") setTempWorkshop([...selectedWorkshops]);
      setEditingSection(section);
    }
  };

  const handleSubmit = () => {
    if (!basicDetails.fullName || !basicDetails.email || !basicDetails.phone) {
      toast.error("Please complete all required details before submitting.");
      return;
    }

    setLoading(true);

    // Simulate dummy loading delay
    setTimeout(() => {
      toast.success("Registration submitted successfully!");
      router.push("/registration/success");
      setLoading(false);
    }, 1500); // 1.5 seconds delay
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
              size="sm"
              variant="ghost"
              className="text-sm text-[#00509E]"
              onClick={() => toggleEdit("basic")}
            >
              ✎ {editingSection === "basic" ? "Save" : "Edit"}
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
              "registration",
              "councilState",
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
                    setTempBasic({
                      ...tempBasic,
                      [key]: e.target.value,
                    })
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

        {/* Accompanying Person */}
        {accompanyingPersons.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold border-b-2 border-[#00509E] pb-1 text-[#003B73]">
                Accompanying Person
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="text-sm text-[#00509E]"
                onClick={() => toggleEdit("accompany")}
              >
                ✎ {editingSection === "accompany" ? "Save" : "Edit"}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {["name", "relation", "age", "gender", "mealPreference"].map(
                (key) => (
                  <div key={key}>
                    <p className="text-gray-600 capitalize">{key}</p>
                    <Input
                      value={(tempAccompany as any)[key] || ""}
                      onChange={(e) =>
                        setTempAccompany({
                          ...tempAccompany,
                          [key]: e.target.value,
                        })
                      }
                      disabled={editingSection !== "accompany"}
                      className={
                        editingSection === "accompany"
                          ? "ring-1 ring-blue-300"
                          : ""
                      }
                      autoComplete="off"
                    />
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Workshops */}
        {!skippedWorkshops && (
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold border-b-2 border-[#00509E] pb-1 text-[#003B73]">
                Workshop
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="text-sm text-[#00509E]"
                onClick={() => toggleEdit("workshop")}
              >
                ✎ {editingSection === "workshop" ? "Save" : "Edit"}
              </Button>
            </div>
            {editingSection === "workshop" ? (
              <div className="space-y-2">
                {Object.entries(workshopMap).map(([id, w]) => (
                  <label
                    key={id}
                    className="flex items-center justify-between bg-blue-50 p-2 rounded ring-1 ring-blue-200"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {id === "ws1" ? "Pre" : "Post"} - Conference Workshop (
                        {w.date})
                      </p>
                      <p className="text-gray-500">{w.title}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={tempWorkshop.includes(id)}
                      onChange={(e) =>
                        setTempWorkshop((prev) =>
                          e.target.checked
                            ? [...prev, id]
                            : prev.filter((wid) => wid !== id)
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            ) : (
              selectedWorkshops.map((id) => {
                const w = workshopMap[id];
                if (!w) return null;
                return (
                  <div
                    key={id}
                    className="flex justify-between text-sm py-2 border-b last:border-b-0"
                  >
                    <span>
                      {id === "ws1" ? "Pre" : "Post"} - Conference Workshop (
                      {w.date})
                    </span>
                    <div className="text-right">
                      <p className="text-gray-500">{w.title}</p>
                      <p className="font-medium">₹ 8,555.00</p>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* Order Summary */}
        <section>
          <h3 className="text-sm font-semibold border-b-2 border-[#00509E] pb-1 text-[#003B73] mb-2">
            Order Summary
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>
                Gut, Liver & Lifelines
                {!skippedAccompanying && accompanyingPersons.length > 0 && (
                  <>
                    <br />+ 1 Accompanying Person
                  </>
                )}
              </span>
              <span>₹ 18,555.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹ 2,000.00</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₹ 20,555.00</span>
            </div>
          </div>
        </section>

        {/* Confirm Button */}
        <div className="text-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#00509E] hover:bg-[#003B73] text-white transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
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
