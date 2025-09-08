"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";

type PaymentStatus = "success" | "failed" | "pending";

export default function PaymentHistoryTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const itemsPerPage = 15;

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/user/payment/paymentHistory");
        const data = await res.json();
        console.log("Fetched payments:", data);
        if (data.success) setAllPayments(data.payments);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    }
    fetchPayments();
  }, []);

  const filteredPayments = allPayments.filter(
    (payment) =>
      payment.razorpayPaymentId?.toLowerCase().includes(search.toLowerCase()) ||
      payment.paymentProvider?.toLowerCase().includes(search.toLowerCase()) ||
      payment.status?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">
        Payment History
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
        <Input
          type="text"
          placeholder="Search..."
          className="max-w-sm bg-white"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Date and Time</th>
              <th className="px-4 py-3">Payment Mode</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Order Details</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3 font-medium">
                  {payment.razorpayPaymentId}
                </td>
                <td className="px-4 py-3">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {payment.razorpayDetails?.method || payment.paymentProvider}
                </td>
                <td className="px-4 py-3">
                  ₹ {payment.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Badge className={getStatusBadge(payment.status)}>
                    {payment.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    // href={`/registration/payment/${payment._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Order Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between text-sm text-gray-600 px-4 py-2 border-t bg-gray-200">
          <span>
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredPayments.length)} of{" "}
            {filteredPayments.length}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
