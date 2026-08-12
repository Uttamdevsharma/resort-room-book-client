import { apiRequest } from "./client";

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  roomTypeId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user?: { name: string; avatar?: string | null };
  roomType?: { name: string };
}

export const reviewsApi = {
  async listPublicReviews(query?: { roomTypeId?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.roomTypeId) params.append("roomTypeId", query.roomTypeId);
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Review[]>(`/reviews${q}`);
  },

  async createReview(data: { bookingId: string; roomTypeId: string; rating: number; title?: string; comment?: string }) {
    return apiRequest<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMyReviews() {
    return apiRequest<Review[]>("/reviews/customer/my-reviews");
  },

  async updateReview(id: string, data: { rating?: number; title?: string; comment?: string }) {
    return apiRequest<Review>(`/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteReview(id: string) {
    return apiRequest(`/reviews/${id}`, { method: "DELETE" });
  },

  // Admin moderation
  async moderateReview(id: string, status: "APPROVED" | "REJECTED") {
    return apiRequest<Review>(`/reviews/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
