import { apiRequest } from "./client";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  entityType?: string | null;
  entityId?: string | null;
  createdAt: string;
}

export const notificationsApi = {
  async getUnreadCount() {
    return apiRequest<{ unreadCount: number }>("/notifications/unread-count");
  },

  async listMyNotifications(query?: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.unreadOnly) params.append("unreadOnly", "true");
    const q = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<NotificationItem[]>(`/notifications${q}`);
  },

  async markAsRead(notificationIds: string[]) {
    return apiRequest("/notifications", {
      method: "PATCH",
      body: JSON.stringify({ notificationIds }),
    });
  },

  async markAllAsRead() {
    return apiRequest("/notifications/mark-all-read", {
      method: "PATCH",
    });
  },
};
