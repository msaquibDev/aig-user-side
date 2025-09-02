"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const registrationId = searchParams.get("registrationId");

  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState<any>(null);
  console.log("Registration:", registration);
  const [order, setOrder] = useState<any>(null);

  // Fetch registration & create order
  useEffect(() => {
    if (!registrationId) return;

    const initPayment = async () => {
      try {
        setLoading(true);

        // const regRes = await fetch(`/api/user/registration/${registrationId}`);
        // if (!regRes.ok) throw new Error("Failed to fetch registration");
        // const regData = await regRes.json();
        // setRegistration(regData); // ✅ set registration
        // console.log("Fetched registration:", regData);

        const orderRes = await fetch("/api/user/payment/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId }),
        });
        if (!orderRes.ok) throw new Error("Failed to create order");
        const orderData = await orderRes.json();
        console.log("Created order:", orderData);
        setOrder(orderData.order);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load payment info");
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [registrationId]);

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
            router.push("/registration/success/badge");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error(error);
          toast.error("Payment verification error");
        }
      },
      prefill: {
        name: registration?.fullName || "Guest",
        email: registration?.email || "guest@example.com",
        contact: registration?.phone || "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payment</h1>

      {loading && <p>Loading...</p>}

      {registration && (
        <div className="mb-6">
          <p>
            <strong>Name:</strong> {registration.fullName}
          </p>
          <p>
            <strong>Email:</strong> {registration.email}
          </p>
          <p>
            <strong>Amount:</strong> ₹{order?.amount / 100}
          </p>
        </div>
      )}

      <Button onClick={handlePay} disabled={!order}>
        Pay Now
      </Button>
    </div>
  );
}
