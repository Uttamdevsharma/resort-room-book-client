import { apiRequest } from "./client";

export interface RefundRecord {
  id: string;
  paymentId: string;
  bookingId: string;
  amount: number;
  currency: string;
  reason?: string | null;
  status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  stripeRefundId?: string | null;
  processedAt?: string | null;
  createdAt: string;
}

export const refundsApi = {
  async getMyRefunds() {
    return apiRequest<RefundRecord[]>("/customers/my-refunds");
  },

  async getMyRefundDetail(id: string) {
    return apiRequest<RefundRecord>(`/customers/my-refunds/${id}`);
  },

  async listRefundsAdmin(query?: { page?: number; limit?: number; status?: string }) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.status) params.append("status", query.status);
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<RefundRecord[]>(`/refunds${q}`);
  },

  async createRefund(data: { paymentId: string; amount?: number; reason?: string }) {
    return apiRequest<RefundRecord>("/refunds", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getRefundByIdAdmin(id: string) {
    return apiRequest<RefundRecord>(`/refunds/${id}`);
  },
};
