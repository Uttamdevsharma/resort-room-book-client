import { apiRequest } from "./client";

export interface Facility {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  openingHours?: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export const facilitiesApi = {
  async list() {
    return apiRequest<Facility[]>("/facilities");
  },

  async getById(id: string) {
    return apiRequest<Facility>(`/facilities/${id}`);
  },

  async create(data: Partial<Facility>) {
    return apiRequest<Facility>("/facilities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Facility>) {
    return apiRequest<Facility>(`/facilities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiRequest(`/facilities/${id}`, { method: "DELETE" });
  },
};
