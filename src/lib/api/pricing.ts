import { apiRequest } from "./client";

export interface PricingRule {
  id: string;
  name: string;
  roomTypeId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  multiplier: number;
  reason?: string | null;
  status: "ACTIVE" | "INACTIVE";
  roomType?: { name: string };
}

export const pricingApi = {
  async list() {
    return apiRequest<PricingRule[]>("/pricing-rules");
  },

  async getById(id: string) {
    return apiRequest<PricingRule>(`/pricing-rules/${id}`);
  },

  async create(data: Partial<PricingRule>) {
    return apiRequest<PricingRule>("/pricing-rules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<PricingRule>) {
    return apiRequest<PricingRule>(`/pricing-rules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiRequest(`/pricing-rules/${id}`, { method: "DELETE" });
  },
};
