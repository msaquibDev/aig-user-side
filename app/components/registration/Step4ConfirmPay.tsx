"use client";

import { useState } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const workshopMap: Record<string, string> = {
  ws1: "Pre-Conference Workshop (31 May 2025)",
  ws2: "Post-Conference Workshop (3 June 2025)",
};

export default function Step4ConfirmPay({ onBack }: { onBack: () => void }) {
  const {
    basicDetails,
    accompanyingPersons,
    selectedWorkshops,
    updateBasicDetails,
    setAccompanyingPersons,
    setSelectedWorkshops,
  } = useRegistrationStore();

  const [editBasic, setEditBasic] = useState(false);
  const [editAccompany, setEditAccompany] = useState(false);
  const [editWorkshops, setEditWorkshops] = useState(false);

  const [formData, setFormData] = useState({ ...basicDetails });
  const [accompanyData, setAccompanyData] = useState(
    accompanyingPersons[0] || {
      name: "",
      age: "",
      gender: "female",
      relation: "",
      mealPreference: "veg",
    }
  );

  const [workshopData, setWorkshopData] = useState([...selectedWorkshops]);

  const handleBasicSave = () => {
    updateBasicDetails(formData);
    setEditBasic(false);
  };

  const handleAccompanySave = () => {
    setAccompanyingPersons([accompanyData]);
    setEditAccompany(false);
  };

  const handleWorkshopSave = () => {
    setSelectedWorkshops(workshopData);
    setEditWorkshops(false);
  };

  const handleSubmit = () => {
    if (
      !basicDetails.fullName.trim() ||
      !basicDetails.email.trim() ||
      !basicDetails.phone.trim()
    ) {
      toast.error("Please complete all required details before submitting.");
      return;
    }

    toast.success("Registration submitted successfully!");
    console.log({ basicDetails, accompanyingPersons, selectedWorkshops });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#003B73]">Review & Confirm</h2>

      {/* Basic Details */}
      <div className="border rounded p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Basic Details</h3>
          <Button
            size="sm"
            variant={"outline"}
            className="border-[#00509E] text-[#00509E] hover:bg-[#003B73] hover:text-white cursor-pointer"
            onClick={() => setEditBasic(!editBasic)}
          >
            {editBasic ? "Cancel" : "Edit"}
          </Button>
        </div>

        {editBasic ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              placeholder="Designation"
              value={formData.designation || ""}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
            />
            <Button
              onClick={handleBasicSave}
              className="col-span-2 w-fit bg-[#00509E] text-white hover:bg-[#003B73] cursor-pointer"
            >
              Save
            </Button>
          </div>
        ) : (
          <>
            <div>
              <strong>Name:</strong> {basicDetails.fullName}
            </div>
            <div>
              <strong>Email:</strong> {basicDetails.email}
            </div>
            <div>
              <strong>Phone:</strong> {basicDetails.phone}
            </div>
            <div>
              <strong>Designation:</strong> {basicDetails.designation}
            </div>
          </>
        )}
      </div>

      {/* Accompanying Person */}
      <div className="border rounded p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Accompanying Person</h3>
          <Button
            size="sm"
            variant={"outline"}
            className="border-[#00509E] text-[#00509E] hover:bg-[#003B73] hover:text-white cursor-pointer"
            onClick={() => setEditAccompany(!editAccompany)}
          >
            {editAccompany ? "Cancel" : "Edit"}
          </Button>
        </div>

        {editAccompany ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Name"
              value={accompanyData.name}
              onChange={(e) =>
                setAccompanyData({ ...accompanyData, name: e.target.value })
              }
            />
            <Input
              placeholder="Age"
              value={accompanyData.age}
              onChange={(e) =>
                setAccompanyData({ ...accompanyData, age: e.target.value })
              }
            />
            <Input
              placeholder="Gender"
              value={accompanyData.gender}
              onChange={(e) =>
                setAccompanyData({
                  ...accompanyData,
                  gender: e.target.value as any,
                })
              }
            />
            <Input
              placeholder="Relation"
              value={accompanyData.relation}
              onChange={(e) =>
                setAccompanyData({
                  ...accompanyData,
                  relation: e.target.value,
                })
              }
            />
            <Input
              placeholder="Meal Preference"
              value={accompanyData.mealPreference}
              onChange={(e) =>
                setAccompanyData({
                  ...accompanyData,
                  mealPreference: e.target.value as any,
                })
              }
            />
            <Button
              onClick={handleAccompanySave}
              className="col-span-2 w-fit bg-[#00509E] text-white hover:bg-[#003B73] cursor-pointer"
            >
              Save
            </Button>
          </div>
        ) : accompanyingPersons.length > 0 ? (
          <>
            <div>
              <strong>Name:</strong> {accompanyingPersons[0].name}
            </div>
            <div>
              <strong>Age:</strong> {accompanyingPersons[0].age}
            </div>
            <div>
              <strong>Gender:</strong> {accompanyingPersons[0].gender}
            </div>
            <div>
              <strong>Relation:</strong> {accompanyingPersons[0].relation}
            </div>
            <div>
              <strong>Meal Preference:</strong>{" "}
              {accompanyingPersons[0].mealPreference}
            </div>
          </>
        ) : (
          <div className="text-gray-500">No accompanying person added.</div>
        )}
      </div>

      {/* Workshops */}
      <div className="border rounded p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Workshops</h3>
          <Button
            size="sm"
            variant={"outline"}
            className="border-[#00509E] text-[#00509E] hover:bg-[#003B73] hover:text-white cursor-pointer"
            onClick={() => setEditWorkshops(!editWorkshops)}
          >
            {editWorkshops ? "Cancel" : "Edit"}
          </Button>
        </div>

        {editWorkshops ? (
          <div className="space-y-2">
            {Object.entries(workshopMap).map(([id, label]) => (
              <label key={id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={workshopData.includes(id)}
                  onChange={(e) =>
                    setWorkshopData((prev) =>
                      e.target.checked
                        ? [...prev, id]
                        : prev.filter((wid) => wid !== id)
                    )
                  }
                />
                <span>{label}</span>
              </label>
            ))}
            <Button
              onClick={handleWorkshopSave}
              className="col-span-2 w-fit bg-[#00509E] text-white hover:bg-[#003B73] cursor-pointer"
            >
              Save
            </Button>
          </div>
        ) : selectedWorkshops.length > 0 ? (
          <ul className="list-disc list-inside">
            {selectedWorkshops.map((id) => (
              <li key={id}>{workshopMap[id]}</li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No workshops selected.</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Confirm & Pay
        </Button>
      </div>
    </div>
  );
}
