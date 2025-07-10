import PaymentHistoryTable from "@/app/components/dashboard/PaymentHistoryTable";

export default function PaymentsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">
        Payment History
      </h1>
      <PaymentHistoryTable />
    </div>
  );
}
