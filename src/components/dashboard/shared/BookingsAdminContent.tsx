"use client";

import { useState, useEffect } from "react";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { Search, CalendarCheck, CheckCircle2, LogOut, XCircle } from "lucide-react";

export function BookingsAdminContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchBookings = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const res = await bookingsApi.listAllBookings({
        page: currentPage,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
      });

      if (res.data) setBookings(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      console.error("Error loading admin bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page, status, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBookings(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Bookings Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage guest reservations, check-in, check-out, and status updates</p>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="p-4 bg-card border border-border rounded-2xl flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by booking # or guest email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
        >
          <option value="">All Statuses</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
          <option value="CHECKED_IN">CHECKED IN</option>
          <option value="CHECKED_OUT">CHECKED OUT</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <Button type="submit" variant="primary">
          Filter
        </Button>
      </form>

      {isLoading ? (
        <Loading text="Loading bookings database..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Booking #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Check-In / Out</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-primary">#{b.bookingNumber}</td>
                    <td className="p-4 font-semibold text-foreground">
                      {b.customer?.name || "Customer"}
                      <span className="block text-xs font-normal text-muted-foreground">{b.customer?.email}</span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(b.checkIn).toLocaleDateString()} &mdash; {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-extrabold text-foreground">${b.totalAmount}</td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(b.bookingStatus)}>{b.bookingStatus}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(b.paymentStatus)} size="sm">{b.paymentStatus}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => {}}>
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(p) => setPage(p)}
            className="p-4"
          />
        </div>
      )}
    </div>
  );
}