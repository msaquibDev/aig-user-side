"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Event } from "@/app/store/useEventStore";

interface CheckoutSummaryProps {
  order: any;
  event?: Event | null;
  onPay: () => void;
}

export default function CheckoutSummary({
  event,
  order,
  onPay,
}: CheckoutSummaryProps) {
  const subTotal = order?.amount ? order.amount / 100 : 0;
  const total = subTotal;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Order Details */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Checkout</h2>
        <div className="border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={event?.eventImage || "/images/event-placeholder.png"}
              alt={event?.eventName || "Event"}
              width={60}
              height={60}
              className="rounded-lg object-cover"
            />
            <div>
              <h3 className="text-base font-medium">
                {event?.eventName || "Event Name"}
              </h3>
              {order?.accompanyingCount > 0 && (
                <p className="text-sm text-gray-500">
                  + {order.accompanyingCount} Accompanying Person
                  {order.accompanyingCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <p className="text-lg font-semibold">₹ {subTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="border rounded-xl p-4 h-fit space-y-4">
        <h3 className="text-lg font-semibold">Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹ {subTotal.toLocaleString()}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-base">
            <span>Payable Amount</span>
            <span>₹ {total.toLocaleString()}</span>
          </div>
        </div>

        <Button
          onClick={onPay}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md"
        >
          Proceed to Pay ₹ {total.toLocaleString()}
        </Button>
      </div>
    </div>
  );
}
