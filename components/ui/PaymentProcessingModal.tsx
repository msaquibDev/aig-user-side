// components/ui/PaymentProcessingModal.tsx
"use client";

import { useEffect } from "react";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  status: "idle" | "processing" | "success" | "failed";
  onClose: () => void;
}

const PaymentProcessingModal = ({
  isOpen,
  status,
  onClose,
}: PaymentProcessingModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return {
          icon: "🔄",
          title: "Processing Payment",
          message: "Please wait while we verify your payment...",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "success":
        return {
          icon: "✅",
          title: "Payment Successful!",
          message: "Your payment has been verified successfully.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "failed":
        return {
          icon: "❌",
          title: "Payment Failed",
          message: "We encountered an issue processing your payment.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: "🔄",
          title: "Processing...",
          message: "Please wait...",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg p-8 max-w-md w-full mx-auto ${config.bgColor} border ${config.borderColor} shadow-xl`}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">{config.icon}</div>
          <h3 className={`text-xl font-semibold mb-3 ${config.color}`}>
            {config.title}
          </h3>
          <p className="text-gray-600 mb-6">{config.message}</p>

          {status === "processing" && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4">
            {status === "processing" && "This may take a few seconds..."}
            {status === "success" && "Redirecting to success page..."}
            {status === "failed" && "You will be redirected to try again..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingModal;
