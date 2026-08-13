import { apiRequest } from "./client";

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  roomId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  bookingStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED" | "NO_SHOW";
  paymentStatus: "PENDING" | "PAID" | "PARTIALLY_PAID" | "FAILED" | "CANCELLED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  couponCode?: string | null;
  specialRequest?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  room?: {
    id: string;
    roomNumber: string;
    floor?: number | null;
    roomType?: {
      id: string;
      name: string;
      slug: string;
      basePrice: number;
    };
  };
  roomType?: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
  };
  guests?: any[];
  payments?: any[];
  refunds?: any[];
}

export interface CreateBookingGuest {
  fullName: string;
  phone?: string | null;
  email?: string | null;
  isPrimary?: boolean;
}

export interface CreateBookingPayload {
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  couponCode?: string;
  specialRequest?: string;
  guests: CreateBookingGuest[];
}

export const bookingsApi = {
  async create(data: CreateBookingPayload) {
    return apiRequest<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async listMyBookings(query?: { page?: number; limit?: number; status?: string }) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.status) params.append("status", query.status);
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Booking[]>(`/customers/my-bookings${q}`);
  },

  async getMyBookingById(id: string) {
    return apiRequest<Booking>(`/customers/my-bookings/${id}`);
  },

  async cancelMyBooking(id: string, reason?: string) {
    return apiRequest<Booking>(`/customers/my-bookings/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  // Staff / Admin Endpoints
  async listAllBookings(query?: { page?: number; limit?: number; status?: string; search?: string }) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.status) params.append("status", query.status);
    if (query?.search) params.append("search", query.search);
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Booking[]>(`/bookings${q}`);
  },

  async getById(id: string) {
    return apiRequest<Booking>(`/bookings/${id}`);
  },

  async updateStatus(id: string, bookingStatus: string, note?: string) {
    return apiRequest<Booking>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ bookingStatus, note }),
    });
  },

  async cancelByStaff(id: string, reason?: string) {
    return apiRequest<Booking>(`/bookings/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};
