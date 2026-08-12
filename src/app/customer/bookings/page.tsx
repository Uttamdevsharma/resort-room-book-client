"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Calendar, ArrowRight, Clock, CreditCard } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 5, total: 0, totalPage: 1 });
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchBookings = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const res = await bookingsApi.listMyBookings({
        page: currentPage,
        limit: 5,
        status: statusFilter || undefined,
      });

      if (res.data) setBookings(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      console.error("Error loading my bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your resort stay reservations</p>
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-hidden"
        >
          <option value="">All Statuses</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
          <option value="CHECKED_IN">CHECKED IN</option>
          <option value="CHECKED_OUT">CHECKED OUT</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {isLoading ? (
        <Loading text="Retrieving your reservations..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          description="You haven't made any resort room bookings yet. Explore our luxury rooms and plan your getaway!"
          action={{
            label: "Explore Rooms",
            onClick: () => (window.location.href = "/rooms"),
          }}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-6 bg-card border border-border rounded-2xl shadow-xs hover:border-primary/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-foreground text-lg">#{b.bookingNumber}</span>
                  <Badge variant={getStatusBadgeVariant(b.bookingStatus)}>{b.bookingStatus}</Badge>
                  <Badge variant={getStatusBadgeVariant(b.paymentStatus)} size="sm">
                    {b.paymentStatus}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}
                  </span>
                  <span>{b.totalNights} Nights</span>
                  <span>{b.numGuests} Guests</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-4 sm:pt-0 border-t sm:border-0 border-border">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block font-semibold uppercase">Total Amount</span>
                  <span className="text-lg font-extrabold text-primary">${b.totalAmount}</span>
                </div>

                <Link href={`/customer/bookings/${b.id}`}>
                  <Button variant="outline" size="sm" className="gap-1 font-semibold">
                    <span>Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
