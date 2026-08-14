import { apiRequest } from "./client";

export interface CouponValidationResult {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
  subtotal: number;
  finalAmount: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumAmount?: number | null;
  maximumDiscount?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  usageLimit?: number | null;
  status: "ACTIVE" | "INACTIVE";
  _count?: { usages: number };
}

export interface PublicCouponOffer {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumAmount?: number | null;
  maximumDiscount?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

export const couponsApi = {
  async listPublicOffers(limit = 6) {
    return apiRequest<PublicCouponOffer[]>(`/coupons/offers?limit=${limit}`);
  },

  async validateCoupon(code: string, subtotal: number, roomTypeId?: string) {
    return apiRequest<CouponValidationResult>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal, roomTypeId }),
    });
  },

  async listCouponsAdmin() {
    return apiRequest<Coupon[]>("/coupons");
  },

  async createCoupon(data: Partial<Coupon>) {
    return apiRequest<Coupon>("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCoupon(id: string, data: Partial<Coupon>) {
    return apiRequest<Coupon>(`/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteCoupon(id: string) {
    return apiRequest(`/coupons/${id}`, { method: "DELETE" });
  },
};
