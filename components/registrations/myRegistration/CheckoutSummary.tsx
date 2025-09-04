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
  // const taxes = Math.round(total * 0.1); // ✅ temporary example, you can replace with API data

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Order Details */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="cursor-pointer text-gray-500 hover:text-gray-700">
            ←
          </span>{" "}
          Checkout
        </h2>

        <div className="border rounded-xl bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            ORDER DETAILS
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={event?.eventImage || "/images/event-placeholder.png"}
                alt={event?.eventName || "Event"}
                width={70}
                height={70}
                className="rounded-lg object-cover border"
              />
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  {event?.eventName || "Event Name"}
                </h3>
                {/* {order?.accompanyingCount > 0 && (
                  <p className="text-sm text-gray-500">
                    + {order.accompanyingCount} Accompanying Person
                    {order.accompanyingCount > 1 ? "s" : ""}
                  </p>
                )} */}
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              ₹ {subTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="border rounded-xl bg-white p-5 shadow-sm h-fit mt-10 ">
        <h3 className="text-base font-semibold mb-4">Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Sub Total</span>
            <span className="text-gray-800">₹ {subTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            {/* <span className="text-gray-600">Taxes</span>
            <span className="text-gray-800">₹ {taxes.toLocaleString()}</span> */}
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-base">
            <span>Payable Amount</span>
            <span>₹ {total}</span>
          </div>
        </div>

        <Button
          onClick={onPay}
          variant={"default"}
          className="w-full mt-4 bg-[#00509E] hover:bg-[#003f7f] text-white text-base font-semibold rounded-md py-3 cursor-pointer"
        >
          Proceed to Pay ₹ {total.toLocaleString()}
        </Button>
      </div>
    </div>
  );
}
