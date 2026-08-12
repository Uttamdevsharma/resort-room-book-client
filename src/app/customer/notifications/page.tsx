"use client";

import { useState, useEffect } from "react";
import { notificationsApi, NotificationItem } from "@/lib/api/notifications";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationsApi.listMyNotifications();
      if (res.data) setNotifications(res.data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Notifications Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Stay updated on your booking status and payments</p>
        </div>
        {notifications.length > 0 && (
          <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="gap-1 text-xs">
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <Loading text="Checking notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState title="No Notifications" description="You're all caught up! No recent alerts or notifications." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all ${
                n.isRead
                  ? "bg-card border-border opacity-80"
                  : "bg-primary/5 border-primary/20 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                    {n.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
