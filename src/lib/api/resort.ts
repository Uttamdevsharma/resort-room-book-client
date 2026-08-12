import { apiRequest } from "./client";

export interface ResortSettings {
  id: string;
  resortName: string;
  tagline?: string | null;
  description?: string | null;
  logo?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  currency?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  cancellationPolicy?: string | null;
}

export const resortApi = {
  async getSettings() {
    return apiRequest<ResortSettings>("/resort-settings");
  },

  async createSettings(data: Partial<ResortSettings>) {
    return apiRequest<ResortSettings>("/resort-settings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateSettings(id: string, data: Partial<ResortSettings>) {
    return apiRequest<ResortSettings>(`/resort-settings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
