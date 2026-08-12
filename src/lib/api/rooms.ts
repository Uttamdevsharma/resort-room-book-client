import { apiRequest } from "./client";

export interface PhysicalRoom {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  floor?: number | null;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "INACTIVE";
  notes?: string | null;
  roomType?: {
    id: string;
    name: string;
    basePrice: number;
  };
}

export const roomsApi = {
  async list(query?: { roomTypeId?: string; status?: string }) {
    const params = new URLSearchParams();
    if (query?.roomTypeId) params.append("roomTypeId", query.roomTypeId);
    if (query?.status) params.append("status", query.status);
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<PhysicalRoom[]>(`/rooms${q}`);
  },

  async getById(id: string) {
    return apiRequest<PhysicalRoom>(`/rooms/${id}`);
  },

  async create(data: Partial<PhysicalRoom>) {
    return apiRequest<PhysicalRoom>("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<PhysicalRoom>) {
    return apiRequest<PhysicalRoom>(`/rooms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, status: string, notes?: string) {
    return apiRequest<PhysicalRoom>(`/rooms/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  },

  async delete(id: string) {
    return apiRequest(`/rooms/${id}`, { method: "DELETE" });
  },
};
