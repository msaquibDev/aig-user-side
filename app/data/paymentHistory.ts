export type PaymentStatus = "Success" | "Failed";

export type PaymentRecord = {
  id: number;
  dateTime: string;
  mode: string;
  amount: string;
  status: PaymentStatus;
  orderUrl: string;
};

export const dummyPayments = (): PaymentRecord[] => [
  {
    id: 1,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 2,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: 3,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 4,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 5,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: 6,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 7,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 8,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: 9,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 10,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 11,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: 12,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 13,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 14,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: 15,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 16,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹42,000",
    status: "Success",
    orderUrl: "#",
  },
  {
    id: 17,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "Credit Card",
    amount: "₹20,000",
    status: "Failed",
    orderUrl: "#",
  },
  {
    id: 18,
    dateTime: "11/11/24 07:00:19 PM (IST)",
    mode: "UPI",
    amount: "₹12,000",
    status: "Success",
    orderUrl: "#",
  },
];
