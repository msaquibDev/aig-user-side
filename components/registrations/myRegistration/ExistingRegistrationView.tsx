// components/registrations/myRegistration/ExistingRegistrationView.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge, Download, FileText } from "lucide-react";
import Link from "next/link";

interface ExistingRegistrationViewProps {
  registration: any;
  eventId: string | null;
}

export default function ExistingRegistrationView({
  registration,
  eventId,
}: ExistingRegistrationViewProps) {
  // Extract data from the actual API response structure
  const {
    _id: registrationId,
    eventId: eventData,
    prefix,
    name,
    gender,
    email,
    mobile,
    designation,
    affiliation,
    medicalCouncilState,
    medicalCouncilRegistration,
    mealPreference,
    country,
    city,
    state,
    address,
    isPaid,
    regNum,
    registrationSlabName,
    createdAt,
  } = registration || {};

  const eventName = eventData?.eventName || "Event";
  const actualEventId = eventData?._id || eventId;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#00509E]">
              My Registration Details
            </h1>
            <p className="text-gray-600 mt-1">
              You are already registered for this event
            </p>
          </div>
          <div className="flex gap-3">
            {actualEventId && registrationId && (
              <Link
                href={`/registration/my-registration/badge/${actualEventId}?registrationId=${registrationId}`}
              >
                <Button className="bg-[#00509E] hover:bg-[#004080] text-white cursor-pointer">
                  <Badge className="w-4 h-4 mr-2" />
                  View Badge
                </Button>
              </Link>
            )}
            {/* <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button> */}
            {actualEventId && registrationId && (
              <Link
                href={`/registration/accompanying?eventId=${actualEventId}&registrationId=${registrationId}`}
              >
                <Button className="bg-[#00509E] hover:bg-[#004080] text-white cursor-pointer">
                  Manage Accompanying Persons
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Registration Status */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">
                Registration Complete
              </h3>
              <p className="text-green-600 text-sm">
                Your registration was completed on{" "}
                {createdAt
                  ? new Date(createdAt).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {isPaid ? "Paid" : "Pending Payment"}
              </span>
              {regNum && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {regNum}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Registration Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="font-medium">
                  {prefix} {name}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium">{email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Mobile</label>
                <p className="font-medium">{mobile}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Gender</label>
                <p className="font-medium">{gender}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Designation</label>
                <p className="font-medium">{designation || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Affiliation</label>
                <p className="font-medium">{affiliation || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Registration & Address Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Registration Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Registration ID</label>
                <p className="font-medium text-sm">{registrationId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Event</label>
                <p className="font-medium">{eventName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Category</label>
                <p className="font-medium">{registrationSlabName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Registration Date
                </label>
                <p className="font-medium">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "Unknown date"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Meal Preference</label>
                <p className="font-medium capitalize">{mealPreference}</p>
              </div>
            </div>

            {/* Medical Council Details */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-md mb-3">
                Medical Council Details
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Council State</label>
                  <p className="font-medium text-sm">
                    {medicalCouncilState || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Registration Number
                  </label>
                  <p className="font-medium text-sm">
                    {medicalCouncilRegistration || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Address Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Address</label>
                <p className="font-medium">{address || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">City</label>
                <p className="font-medium">{city || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">State</label>
                <p className="font-medium">{state || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Country</label>
                <p className="font-medium">{country || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {/* <div className="border-t pt-6">
          <div className="flex gap-3 justify-end">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            {actualEventId && registrationId && (
              <Link
                href={`/registration/accompanying?eventId=${actualEventId}&registrationId=${registrationId}`}
              >
                <Button className="bg-[#00509E] hover:bg-[#004080] text-white cursor-pointer">
                  Manage Accompanying Persons
                </Button>
              </Link>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
