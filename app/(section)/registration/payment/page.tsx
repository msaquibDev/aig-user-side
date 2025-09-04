"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CheckoutSummary from "@/components/registrations/myRegistration/CheckoutSummary";
import { useEventStore } from "@/app/store/useEventStore";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId");

  const { events, currentEvent, setCurrentEvent, fetchEvents } =
    useEventStore();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!events.length) fetchEvents();
  }, [events, fetchEvents]);

  // Fetch registration + event + create order
   useEffect(() => {
     if (!registrationId || !events.length) return;

     const initPayment = async () => {
       try {
         setLoading(true);
         const res = await fetch("/api/user/payment/order", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ registrationId }),
         });

         if (!res.ok) throw new Error("Failed to create order");
         const data = await res.json();
         console.log("🔍 Payment API Response:", data);

         // ✅ Order object will include event + accompanyingCount
         setOrder({
           ...data.order,
           event: data.event,
           // accompanyingCount: data.accompanyingCount,
         });
       } catch (error) {
         console.error(error);
         toast.error("Failed to load payment info");
       } finally {
         setLoading(false);
       }
     };

     initPayment();
   }, [registrationId, events, setCurrentEvent]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Razorpay handler
  const handlePay = () => {
    if (!order) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: order.currency,
      name: "Conference Payment",
      description: "Complete your registration payment",
      order_id: order.id,
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/user/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              registrationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            toast.success("Payment successful!");
            setPaymentSuccess(true);
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error(error);
          toast.error("Payment verification error");
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <Suspense fallback={<div className="p-6">Loading payment details...</div>}>
      <div className="p-6">
        {loading && <p>Loading...</p>}
        {paymentSuccess ? (
          <div className="p-4 rounded-lg bg-green-100 text-green-700">
            ✅ Payment successful! Thank you for completing your registration.
          </div>
        ) : (
          order && (
            <CheckoutSummary
              order={order}
              onPay={handlePay}
              event={currentEvent}
            />
          )
        )}
      </div>
    </Suspense>
  );
}
