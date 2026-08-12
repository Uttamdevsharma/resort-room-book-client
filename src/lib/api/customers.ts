import { apiRequest } from "./client";
import { UserProfile } from "./auth";

export interface CustomerUser extends UserProfile {
  _count?: { bookings: number; reviews: number };
}

export const customersApi = {
  async getProfile() {
    return apiRequest<UserProfile>("/customers/profile");
  },

  async updateProfile(data: { name?: string; phone?: string; avatar?: string }) {
    return apiRequest<UserProfile>("/customers/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    return apiRequest("/customers/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Admin / Support Customer management
  async listCustomers(query?: { page?: number; limit?: number; search?: string; status?: string }) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.search) params.append("search", query.search);
    if (query?.status) params.append("status", query.status);
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<CustomerUser[]>(`/customers${q}`);
  },

  async getCustomerById(id: string) {
    return apiRequest<CustomerUser>(`/customers/${id}`);
  },

  async updateCustomerStatus(id: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
    return apiRequest<CustomerUser>(`/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
