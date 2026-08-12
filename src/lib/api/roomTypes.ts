import { apiRequest } from "./client";

export interface RoomTypeMedia {
  id: string;
  url: string;
  mediaType: "IMAGE" | "VIDEO";
  altText?: string | null;
  sortOrder: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string | null;
  category?: string | null;
  description?: string | null;
}

export interface RoomType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  maxGuests: number;
  maxAdults: number;
  maxChildren: number;
  roomSizeSqFt?: number | null;
  bedType: string;
  status: "ACTIVE" | "INACTIVE";
  roomTypeAmenities?: { amenity: Amenity }[];
  media?: RoomTypeMedia[];
  _count?: { rooms: number };
}

export interface ListRoomTypesQuery {
  page?: number;
  limit?: number;
  search?: string;
  bedType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  maxGuests?: number;
}

export const roomTypesApi = {
  async list(query?: ListRoomTypesQuery) {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          params.append(k, String(v));
        }
      });
    }
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<RoomType[]>(`/room-types${q}`);
  },

  async getById(id: string) {
    return apiRequest<RoomType>(`/room-types/${id}`);
  },

  async create(data: Partial<RoomType>) {
    return apiRequest<RoomType>("/room-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<RoomType>) {
    return apiRequest<RoomType>(`/room-types/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiRequest(`/room-types/${id}`, { method: "DELETE" });
  },

  async addAmenities(roomTypeId: string, amenityIds: string[]) {
    return apiRequest(`/room-types/${roomTypeId}/amenities`, {
      method: "POST",
      body: JSON.stringify({ amenityIds }),
    });
  },

  async removeAmenities(roomTypeId: string, amenityIds: string[]) {
    return apiRequest(`/room-types/${roomTypeId}/amenities`, {
      method: "DELETE",
      body: JSON.stringify({ amenityIds }),
    });
  },

  async uploadMedia(roomTypeId: string, data: { url: string; mediaType?: string; altText?: string }) {
    return apiRequest(`/room-types/${roomTypeId}/media`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteMedia(roomTypeId: string, mediaId: string) {
    return apiRequest(`/room-types/${roomTypeId}/media/${mediaId}`, {
      method: "DELETE",
    });
  },
};
