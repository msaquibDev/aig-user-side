"use client";
import { create } from "zustand";

interface RazorpayDetails {
  method?: string;
  upi_transaction_id?: string;
  vpa?: string;
  [key: string]: any;
}

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  paymentProvider: string;
  razorpayPaymentId?: string;
  createdAt: string;
  razorpayDetails?: RazorpayDetails;
}

interface PaymentStore {
  paymentData: Payment | null;
  setPaymentData: (data: Payment) => void;
  clearPaymentData: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  paymentData: null,
  setPaymentData: (data) => set({ paymentData: data }),
  clearPaymentData: () => set({ paymentData: null }),
}));
