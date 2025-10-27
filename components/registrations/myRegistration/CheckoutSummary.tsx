"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Event } from "@/app/store/useEventStore";
import { formatEventDate } from "@/app/utils/formatEventDate";

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
  // ✅ Fixed amount calculation - order.amount is already in rupees (not paise at this stage)
  const total = order?.amount || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Left: Order Details */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

        <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            ORDER DETAILS
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={event?.eventImage || "/eventImg/event1.png"}
                alt={event?.eventName || "Event"}
                width={80}
                height={80}
                className="rounded-lg object-cover border shadow-sm"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {event?.eventName || "Event Name"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatEventDate(event?.startDate, event?.endDate)}
                </p>
                {order?.registrationCategory && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {order.registrationCategory}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">
              ₹ {total.toLocaleString("en-IN")}.00
            </p>
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Secure Payment
              </p>
              <p className="text-xs text-blue-600">
                Your payment is protected with Razorpay security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">
          Summary
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Registration Fee</span>
            <span className="text-gray-800 font-medium">
              ₹ {total.toLocaleString("en-IN")}.00
            </span>
          </div>

          {/* You can add taxes here if needed */}
          {/* <div className="flex justify-between items-center">
            <span className="text-gray-600">Taxes (18%)</span>
            <span className="text-gray-800 font-medium">₹ {Math.round(total * 0.18).toLocaleString("en-IN")}.00</span>
          </div> */}

          <hr className="my-4 border-gray-300" />

          <div className="flex justify-between items-center font-semibold text-lg">
            <span className="text-gray-900">Total Amount</span>
            <span className="text-green-600">
              ₹ {total.toLocaleString("en-IN")}.00
            </span>
          </div>
        </div>

        <Button
          onClick={onPay}
          className="w-full mt-6 bg-[#00509E] hover:bg-[#003B73] text-white text-base font-semibold rounded-lg py-3 transition-colors duration-200"
          size="lg"
        >
          Proceed to Pay ₹ {total.toLocaleString("en-IN")}.00
        </Button>

        <div className="mt-4 text-center">
          <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure payment powered by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
