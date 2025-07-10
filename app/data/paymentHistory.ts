export type PaymentStatus = "Success" | "Failed";

export type PaymentRecord = {
  id: string;
  dateTime: string;
  mode: string;
  amount: string;
  status: PaymentStatus;
  orderUrl: string;
};

export const dummyPayments = (): PaymentRecord[] => [
  {
    id: "#12341",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#45765",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: "#56212",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#12341",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#45765",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: "#56212",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#12341",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#45765",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: "#56212",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#12341",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#45765",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: "#56212",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#12341",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#45765",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: "#56212",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#12341",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: "#45765",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: "#56212",
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
];
