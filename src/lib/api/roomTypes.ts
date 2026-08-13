import { apiRequest } from "./client";

export interface RoomTypeMedia {
  roomTypeMediaId: string;
  id: string;
  url: string;
  mediaType: "IMAGE" | "VIDEO";
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
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
  shortDescription?: string | null;
  basePrice: number;
  maxGuests: number;
  maxAdults: number;
  maxChildren: number;
  roomSizeSqFt?: number | null;
  roomSize?: string | null;
  viewType?: string | null;
  bedType: string;
  bedCount?: number | null;
  featured?: boolean;
  status: "ACTIVE" | "INACTIVE";
  roomTypeAmenities?: { amenity: Amenity }[];
  media?: RoomTypeMedia[];
  _count?: { rooms: number };
}

export interface UploadRoomTypeMediaItem {
  dataUrl: string;
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface RoomTypeMediaOrderItem {
  roomTypeMediaId: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

interface RawRoomTypeMedia {
  id: string;
  roomTypeId: string;
  mediaId: string;
  isPrimary: boolean;
  sortOrder: number;
  media?: {
    id: string;
    url: string;
    publicId: string | null;
    type: "IMAGE" | "VIDEO";
    altText: string | null;
  } | null;
}

export const normalizeMedia = (
  media: RawRoomTypeMedia[] | undefined | null,
): RoomTypeMedia[] => {
  if (!media) return [];
  return media
    .filter((m) => m?.media)
    .map((m) => ({
      roomTypeMediaId: m.id,
      id: m.media!.id,
      url: m.media!.url,
      mediaType: m.media!.type,
      altText: m.media!.altText,
      sortOrder: m.sortOrder,
      isPrimary: m.isPrimary,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

interface RawRoomType extends Omit<RoomType, "media" | "roomTypeMedia"> {
  roomTypeMedia?: RawRoomTypeMedia[];
}

const normalizeRoomType = (rt: RawRoomType): RoomType => ({
  ...rt,
  media: normalizeMedia(rt?.roomTypeMedia),
});

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
    const res = await apiRequest<RoomType[]>(`/room-types${q}`);
    return { ...res, data: (res.data ?? []).map(normalizeRoomType) };
  },

  async getById(id: string) {
    const res = await apiRequest<RoomType>(`/room-types/${id}`);
    return { ...res, data: res.data ? normalizeRoomType(res.data) : undefined };
  },

  async create(data: Partial<RoomType>) {
    const res = await apiRequest<RoomType>("/room-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { ...res, data: res.data ? normalizeRoomType(res.data) : undefined };
  },

  async update(id: string, data: Partial<RoomType>) {
    const res = await apiRequest<RoomType>(`/room-types/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return { ...res, data: res.data ? normalizeRoomType(res.data) : undefined };
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

  async uploadMedia(roomTypeId: string, images: UploadRoomTypeMediaItem[]) {
    return apiRequest<{ id: string; name: string; roomTypeMedia: RawRoomTypeMedia[] }>(
      `/room-types/${roomTypeId}/media`,
      {
        method: "POST",
        body: JSON.stringify({ images }),
      },
    );
  },

  async updateMediaOrder(
    roomTypeId: string,
    images: RoomTypeMediaOrderItem[],
  ) {
    return apiRequest<{ id: string; name: string; roomTypeMedia: RawRoomTypeMedia[] }>(
      `/room-types/${roomTypeId}/media`,
      {
        method: "PATCH",
        body: JSON.stringify({ images }),
      },
    );
  },

  async deleteMedia(roomTypeId: string, roomTypeMediaId: string) {
    return apiRequest<{ id: string; name: string; roomTypeMedia: RawRoomTypeMedia[] }>(
      `/room-types/${roomTypeId}/media/${roomTypeMediaId}`,
      { method: "DELETE" },
    );
  },
};
