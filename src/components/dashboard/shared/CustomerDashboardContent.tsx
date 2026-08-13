"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { useAuth } from "@/lib/context/AuthContext";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  CalendarCheck,
  CreditCard,
  Receipt,
  Star,
  Bell,
  User,
  ArrowRight,
  Calendar,
  Sparkles,
} from "lucide-react";

const quickActions = [
  { label: "My Bookings", href: "/customer/bookings", icon: CalendarCheck, description: "View and manage reservations" },
  { label: "Payments", href: "/customer/payments", icon: CreditCard, description: "Payment history and invoices" },
  { label: "Refunds", href: "/customer/refunds", icon: Receipt, description: "Track refund requests" },
  { label: "Reviews", href: "/customer/reviews", icon: Star, description: "Share your stay experience" },
  { label: "Notifications", href: "/customer/notifications", icon: Bell, description: "Booking and payment alerts" },
  { label: "Profile Settings", href: "/customer/profile", icon: User, description: "Update personal details" },
];

export function CustomerDashboardContent() {
  const { user, roles } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await bookingsApi.listMyBookings({ limit: 5 });
        if (res.data) setBookings(res.data);
      } catch (err) {
        console.error("Error loading customer dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary-light">
            Customer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-primary-light mt-1">
            {roles.length ? `Role: ${roles.join(", ")}` : "Your resort dashboard"}
          </p>
        </div>
        <Link href="/rooms">
          <Button className="bg-white text-primary hover:bg-zinc-100 font-bold gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Book a Room</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
          <Link href="/customer/bookings" className="text-xs font-bold text-primary hover:underline">
            View All &rarr;
          </Link>
        </div>

        {isLoading ? (
          <Loading text="Fetching your reservations..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No Bookings Yet"
            description="Explore our luxury rooms and make your first reservation!"
            action={{
              label: "Explore Rooms",
              onClick: () => router.push("/rooms"),
            }}
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">#{b.bookingNumber}</span>
                      <Badge variant={getStatusBadgeVariant(b.bookingStatus)} size="sm">
                        {b.bookingStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()} &bull;{" "}
                      {b.nights} nights
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-extrabold text-primary">${b.totalAmount}</span>
                  <Link href={`/customer/bookings/${b.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 font-semibold">
                      <span>Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}