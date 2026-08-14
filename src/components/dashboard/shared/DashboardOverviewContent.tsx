"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { roomsApi, PhysicalRoom } from "@/lib/api/rooms";
import { paymentsApi, PaymentRecord } from "@/lib/api/payments";
import { useAuth } from "@/lib/context/AuthContext";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardOverviewSkeleton } from "@/components/dashboard/skeletons";
import {
  CalendarCheck,
  BedDouble,
  DoorOpen,
  CreditCard,
  ArrowRight,
} from "lucide-react";

interface DashboardOverviewContentProps {
  showHeroBanner?: boolean;
}

export function DashboardOverviewContent({ showHeroBanner = true }: DashboardOverviewContentProps) {
  const { user, roles } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const [bRes, rtRes, rRes, pRes] = await Promise.allSettled([
          bookingsApi.listAllBookings({ limit: 5 }),
          roomTypesApi.list(),
          roomsApi.list(),
          paymentsApi.listPaymentsAdmin({ limit: 5 }),
        ]);

        if (bRes.status === "fulfilled" && bRes.value.data) setBookings(bRes.value.data);
        if (rtRes.status === "fulfilled" && rtRes.value.data) setRoomTypes(rtRes.value.data);
        if (rRes.status === "fulfilled" && rRes.value.data) setRooms(rRes.value.data);
        if (pRes.status === "fulfilled" && pRes.value.data) setPayments(pRes.value.data);
      } catch (err) {
        console.error("Dashboard overview error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardStats();
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === "PAID" || p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;

  return (
    <div className="space-y-8">
      {showHeroBanner && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary-light">
              Staff Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {user?.name}!</h1>
            <p className="text-sm text-primary-light mt-1">
              Role: <span className="font-semibold text-white">{roles.join(", ")}</span>
            </p>
          </div>
          <Link href="/dashboard/bookings">
            <Button className="bg-white text-primary hover:bg-zinc-100 font-bold gap-2">
              <span>Manage Bookings</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <DashboardOverviewSkeleton />
      ) : (
        <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Bookings</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-foreground mt-3 block">{bookings.length}</span>
          <span className="text-xs text-muted-foreground mt-1 block">Active system reservations</span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Room Types</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <BedDouble className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-foreground mt-3 block">{roomTypes.length}</span>
          <span className="text-xs text-muted-foreground mt-1 block">Configured suite categories</span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Physical Rooms</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DoorOpen className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-foreground mt-3 block">{rooms.length}</span>
          <span className="text-xs text-muted-foreground mt-1 block">
            {availableRooms} Available &bull; {occupiedRooms} Occupied
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Recent Revenue</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-foreground mt-3 block">${totalRevenue}</span>
          <span className="text-xs text-muted-foreground mt-1 block">Processed Stripe payments</span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-xs font-bold text-primary hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-primary">#{b.bookingNumber}</td>
                    <td className="p-3 font-medium text-foreground">{b.customer?.name || "Customer"}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(b.checkIn).toLocaleDateString()} &mdash; {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-extrabold text-foreground">${b.totalAmount}</td>
                    <td className="p-3">
                      <Badge variant={getStatusBadgeVariant(b.bookingStatus)}>{b.bookingStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
        </>
      )}
    </div>
  );
}