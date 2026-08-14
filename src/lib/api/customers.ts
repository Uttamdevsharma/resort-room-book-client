import { apiRequest } from "./client";
import { UserProfile } from "./auth";

export interface CustomerUser extends UserProfile {
  _count?: { bookings: number; reviews: number };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;   // Role name e.g. RESORT_MANAGER
  roleId?: string; // Role DB id (optional fallback)
}

export interface ListCustomersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  staffOnly?: boolean;
}

interface RawUserRole {
  role?: { name?: string };
}

interface RawUser {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  userRoles?: RawUserRole[];
  phone?: string | null;
  avatar?: string | null;
  emailVerified?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  permissions?: string[];
  _count?: { bookings: number; reviews: number };
}

function normalizeUser(raw: RawUser): CustomerUser {
  const { userRoles, roles, ...rest } = raw;
  const roleNames = (userRoles || [])
    .map((ur) => ur?.role?.name)
    .filter((name): name is string => Boolean(name));
  return {
    ...rest,
    roles: roleNames.length > 0 ? roleNames : roles,
  };
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
  async listCustomers(query?: ListCustomersQuery) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.search) params.append("search", query.search);
    if (query?.status) params.append("status", query.status);
    if (query?.staffOnly) params.append("staffOnly", "true");
    const q = params.toString() ? `${params.toString()}` : "";
    const res = await apiRequest<CustomerUser[]>(`/customers${q ? `?${q}` : ""}`);
    if (res.data) {
      return { ...res, data: res.data.map(normalizeUser) };
    }
    return res;
  },

  async getCustomerById(id: string) {
    const res = await apiRequest<CustomerUser>(`/customers/${id}`);
    if (res.data) {
      return { ...res, data: normalizeUser(res.data) };
    }
    return res;
  },

  async updateCustomerStatus(id: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
    const res = await apiRequest<CustomerUser>(`/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.data) {
      return { ...res, data: normalizeUser(res.data) };
    }
    return res;
  },

  async createUser(data: CreateUserData) {
    return apiRequest<CustomerUser>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteUser(id: string) {
    return apiRequest(`/customers/${id}`, { method: "DELETE" });
  },
};
