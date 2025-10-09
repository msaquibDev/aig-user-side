// app/(section)/registration/payment/failed/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const registrationId = searchParams.get("registrationId");
  const errorMessage =
    searchParams.get("message") || "Payment could not be processed";
  const paymentId = searchParams.get("paymentId");

  const handleRetryPayment = () => {
    if (registrationId) {
      router.push(`/registration/payment?registrationId=${registrationId}`);
    } else {
      router.push("/dashboard/events");
    }
  };

  const handleBackToEvents = () => {
    router.push("/dashboard/events");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Failure Header */}
        <Card className="border-red-200 shadow-lg mb-6">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-red-800 mb-2">
              Payment Failed
            </h1>
            <p className="text-red-600 text-lg mb-4">{errorMessage}</p>
            {paymentId && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 inline-block">
                <p className="text-red-800 font-mono text-sm">
                  Reference: {paymentId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting Tips */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What could have gone wrong?
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Card declined by your bank</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Network connectivity issues</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Payment timeout</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleRetryPayment}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Payment Again
          </Button>

          <Button
            onClick={handleBackToEvents}
            variant="outline"
            className="border-gray-400 text-gray-700 hover:bg-gray-100 px-8 py-3 text-lg"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </Button>
        </div>

        {/* Support Information */}
        {/* <Card className="mt-8 border-orange-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Help?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                If you continue to face issues, please contact our support team:
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">Event Support Team</p>
                <p>Email: support@aighospitals.com</p>
                <p>Phone: +91-XXXXXXXXXX</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
