import { apiRequest } from "./client";

export interface Amenity {
  id: string;
  name: string;
  icon?: string | null;
  category?: string | null;
  description?: string | null;
}

export const amenitiesApi = {
  async list() {
    return apiRequest<Amenity[]>("/amenities");
  },

  async getById(id: string) {
    return apiRequest<Amenity>(`/amenities/${id}`);
  },

  async create(data: Partial<Amenity>) {
    return apiRequest<Amenity>("/amenities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Amenity>) {
    return apiRequest<Amenity>(`/amenities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiRequest(`/amenities/${id}`, { method: "DELETE" });
  },
};
