"use client";

import { dummyPayments } from "@/app/data/paymentHistory";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function PaymentHistoryTable() {
  const payments = dummyPayments();

  return (
    <div className="bg-white border shadow-sm rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
          <Input placeholder="Search..." className="max-w-sm bg-white" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
            <tr>
              <th className="w-10 p-3">
                <input type="checkbox" />
              </th>
              <th className="text-left p-3">Transaction ID</th>
              <th className="text-left p-3">Date and Time</th>
              <th className="text-left p-3">Payment Mode</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3"> </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3 font-medium">{payment.id}</td>
                <td className="p-3">{payment.dateTime}</td>
                <td className="p-3">{payment.mode}</td>
                <td className="p-3">{payment.amount}</td>
                <td className="p-3">
                  <Badge
                    className={
                      payment.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {payment.status}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <a
                    href={payment.orderUrl}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Order Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 bg-gray-50 border-t">
        <span>3–3 of 3</span>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            &lt;
          </Button>
          <span>1/1</span>
          <Button variant="outline" size="sm" disabled>
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
