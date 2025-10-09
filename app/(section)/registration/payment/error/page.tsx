// app/(section)/registration/payment/error/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AlertTriangle, Home, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get("code");
  const errorMessage =
    searchParams.get("message") || "An unexpected error occurred";
  const registrationId = searchParams.get("registrationId");

  const handleBackToEvents = () => {
    router.push("/dashboard/events");
  };

  const handleRetry = () => {
    if (registrationId) {
      router.push(`/registration/payment?registrationId=${registrationId}`);
    } else {
      router.push("/dashboard/events");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Error Header */}
        <Card className="border-orange-200 shadow-lg mb-6">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-orange-800 mb-2">
              Technical Error
            </h1>
            <p className="text-orange-600 text-lg mb-4">
              We encountered a problem while processing your payment
            </p>
            {errorCode && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 inline-block">
                <p className="text-orange-800 font-mono text-sm">
                  Error Code: {errorCode}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Details */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Error Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 text-sm">{errorMessage}</p>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              This is usually a temporary issue. Please try again in a few
              minutes.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleRetry}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={handleBackToEvents}
            variant="outline"
            className="border-gray-400 text-gray-700 hover:bg-gray-100 px-8 py-3 text-lg"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Events
          </Button>
        </div>

        {/* Technical Support */}
        {/* <Card className="mt-8 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Technical Support
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                If the problem persists, our technical team is here to help:
              </p>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Mail className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p>techsupport@aighospitals.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Phone className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p>+91-XXXXXXXXXX (9 AM - 6 PM IST)</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                <p>
                  Please have your registration ID ready when contacting
                  support:
                </p>
                <p className="font-mono bg-gray-100 p-2 rounded mt-1">
                  {registrationId || "Not available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
