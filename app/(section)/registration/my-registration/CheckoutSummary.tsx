// components/registrations/myRegistration/CheckoutSummary.tsx
"use client";

interface CheckoutSummaryProps {
  order: {
    id: string;
    amount: number;
    currency: string;
    razorpayKeyId?: string;
  };
  onPay: () => void;
  event?: any;
  registrationDetails?: any;
}

export default function CheckoutSummary({
  order,
  onPay,
  event,
  registrationDetails,
}: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>

      {/* Event Details */}
      {event && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            {event.eventName}
          </h3>
          <p className="text-blue-700 text-sm">
            {event.startDate && new Date(event.startDate).toLocaleDateString()}
            {event.endDate &&
              ` - ${new Date(event.endDate).toLocaleDateString()}`}
          </p>
        </div>
      )}

      {/* Registration Details */}
      {registrationDetails && (
        <div className="mb-6 space-y-2">
          <h3 className="font-semibold text-gray-900 mb-3">
            Registration Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">{registrationDetails.fullName}</p>
            </div>
            <div>
              <span className="text-gray-600">Category:</span>
              <p className="font-medium">
                {registrationDetails.registrationCategory?.slabName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Registration Fee:</span>
          <span className="font-semibold">
            ₹ {order.amount.toLocaleString("en-IN")}.00
          </span>
        </div>

        {/* Add tax if applicable */}
        {/* <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Tax (18%):</span>
          <span className="font-semibold">
            ₹ {Math.round(order.amount * 0.18).toLocaleString("en-IN")}.00
          </span>
        </div> */}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total Amount:</span>
          <span className="text-lg font-bold text-green-600">
            ₹ {order.amount.toLocaleString("en-IN")}.00
          </span>
        </div>
      </div>

      {/* Pay Button */}
      <div className="mt-8">
        <button
          onClick={onPay}
          className="w-full bg-[#00509E] hover:bg-[#003B73] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Pay Now - ₹ {order.amount.toLocaleString("en-IN")}.00
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}
