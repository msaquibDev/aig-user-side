// app/(section)/registration/payment/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import CheckoutSummary from "@/components/registrations/myRegistration/CheckoutSummary";
import { useEventStore } from "@/app/store/useEventStore";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const registrationId = searchParams.get("registrationId");
  const eventId = searchParams.get("eventId");

  const { currentEvent } = useEventStore();
  const { basicDetails } = useRegistrationStore();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Create Razorpay order when registrationId is available
  useEffect(() => {
    if (!registrationId) {
      toast.error("Registration ID is required");
      router.push("/dashboard/events");
      return;
    }

    const createRazorpayOrder = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Please login again");
          router.push("/login");
          return;
        }

        // Get amount from registration store or use a default
        const amount = basicDetails?.registrationCategory?.amount || 0;

        if (amount <= 0) {
          toast.error("Invalid registration amount");
          return;
        }

        // Create Razorpay order using new backend endpoint
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/create-order/${eventId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              eventRegistrationId: registrationId,
              amount: amount,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Failed to create payment order"
          );
        }

        const data = await res.json();

        if (data.success) {
          setOrder({
            id: data.data.orderId,
            amount: data.data.amount,
            currency: data.data.currency,
            razorpayKeyId: data.data.razorpayKeyId,
            paymentId: data.data.paymentId,
          });
        } else {
          throw new Error("Failed to create order");
        }
      } catch (error) {
        console.error("Payment order creation error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to initialize payment"
        );
      } finally {
        setLoading(false);
      }
    };

    createRazorpayOrder();
  }, [registrationId, basicDetails, router]);

  // ✅ Razorpay payment handler
  const handlePay = () => {
    if (!order) {
      toast.error("Payment order not initialized");
      return;
    }

    const options = {
      key: order.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount * 100, // Convert to paise
      currency: order.currency || "INR",
      name: "AIG Hospitals - Event Registration",
      description: "Complete your event registration payment",
      order_id: order.id,
      // In your payment page's handlePay function - update the handler section:
      handler: async (response: any) => {
        try {
          const token = localStorage.getItem("accessToken");

          const verifyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId: order.paymentId,
              }),
            }
          );

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Redirect to success page
              router.push(
                `/registration/payment/success?registrationId=${registrationId}&paymentId=${response.razorpay_payment_id}`
              );
            } else {
              // Redirect to failed page
              router.push(
                `/registration/payment/failed?registrationId=${registrationId}&paymentId=${response.razorpay_payment_id}`
              );
            }
          } else {
            const errorData = await verifyRes.json();
            // Redirect to failed page with error message
            router.push(
              `/registration/payment/failed?registrationId=${registrationId}&message=${encodeURIComponent(
                errorData.message || "Payment verification failed"
              )}`
            );
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          // Redirect to error page
          router.push(
            `/registration/payment/error?registrationId=${registrationId}&message=${encodeURIComponent(
              "Network error occurred"
            )}`
          );
        }
      },
      prefill: {
        name: basicDetails?.fullName || "",
        email: basicDetails?.email || "",
        contact: basicDetails?.phone || "",
      },
      theme: {
        color: "#00509E", // Your brand color
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <Suspense fallback={<div className="p-6">Loading payment details...</div>}>
      <div className="p-6 max-w-4xl mx-auto">
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-blue-500 font-medium">
              Initializing payment...
            </span>
          </div>
        )}

        {paymentSuccess ? (
          <div className="p-6 rounded-lg bg-green-50 border border-green-200 text-center">
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-green-600 mb-4">
              Your registration has been confirmed. Redirecting to your badge...
            </p>
          </div>
        ) : order ? (
          <CheckoutSummary
            order={order}
            onPay={handlePay}
            event={currentEvent}
          />
        ) : (
          !loading && (
            <div className="text-center p-8">
              <p className="text-gray-600 mb-4">
                Unable to initialize payment.
              </p>
              <button
                onClick={() => router.push("/dashboard/events")}
                className="bg-[#00509E] text-white px-6 py-2 rounded hover:bg-[#003B73]"
              >
                Back to Events
              </button>
            </div>
          )
        )}
      </div>
    </Suspense>
  );
}
