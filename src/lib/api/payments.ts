import { apiRequest } from "./client";

export interface StripeCheckoutResult {
  sessionId: string;
  url: string;
  amount: number;
  currency: string;
  bookingId: string;
  bookingNumber: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  stripePaymentId?: string | null;
  stripeSessionId?: string | null;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionRef?: string | null;
  paidAt?: string | null;
  createdAt: string;
  booking?: {
    bookingNumber: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
  };
}

export const paymentsApi = {
  async createCheckoutSession(bookingId: string, successUrl?: string, cancelUrl?: string) {
    return apiRequest<StripeCheckoutResult>("/payments", {
      method: "POST",
      body: JSON.stringify({ bookingId, successUrl, cancelUrl }),
    });
  },

  async getMyPayments(query?: { page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<PaymentRecord[]>(`/customers/my-payments${q}`);
  },

  async getMyPaymentDetail(id: string) {
    return apiRequest<PaymentRecord>(`/customers/my-payments/${id}`);
  },

  async listPaymentsAdmin(query?: { page?: number; limit?: number; status?: string }) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.status) params.append("status", query.status);
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<PaymentRecord[]>(`/payments${q}`);
  },

  async getPaymentByIdAdmin(id: string) {
    return apiRequest<PaymentRecord>(`/payments/${id}`);
  },
};
