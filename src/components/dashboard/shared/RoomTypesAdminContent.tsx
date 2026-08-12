"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { facilitiesApi, Facility } from "@/lib/api/facilities";
import { customersApi, CustomerUser } from "@/lib/api/customers";
import { paymentsApi, PaymentRecord } from "@/lib/api/payments";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { useAuth } from "@/lib/context/AuthContext";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import {
  Search,
  Filter,
  ArrowRight,
  Users,
  BedDouble,
  SlidersHorizontal,
  DollarSign,
  Building2,
  Mail,
  Clock,
  Calendar,
  CreditCard,
  Ticket,
  Heart,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function RoomTypesAdminContent() {
  const { user, roles } = useAuth();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const isStaff = roles.includes("SUPER_ADMIN") || roles.includes("RESORT_MANAGER") ||
    roles.includes("ROOM_MANAGER") || roles.includes("BOOKING_MANAGER") ||
    roles.includes("CUSTOMER_SUPPORT") || roles.includes("MARKETING_MANAGER") ||
    roles.includes("FINANCE");

  const fetchData = async () => {
    try {
      const res = await roomTypesApi.list({ search: search || undefined });
      if (res.data) setRoomTypes(res.data);
    } catch (err) {
      console.error("Error loading room types:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch("");
    setIsLoading(true);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Room Types</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage suite categories, base pricing, and amenities</p>
        </div>
        {isStaff && (
          <Button onClick={() => {}} variant="primary" className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" /> Add Room Type
          </Button>
        )}
      </div>

      {isLoading ? (
        <Loading text="Loading room types..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Bed Type</th>
                  <th className="p-4">Max Guests</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roomTypes.map((rt) => (
                  <tr key={rt.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{rt.name}</td>
                    <td className="p-4 font-semibold text-primary">{rt.bedType}</td>
                    <td className="p-4">{rt.maxGuests} Guests</td>
                    <td className="p-4 font-extrabold text-foreground">${rt.basePrice}</td>
                    <td className="p-4">
                      <Badge variant={rt.status === "ACTIVE" ? "success" : "danger"}>{rt.status}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" title="Add Image URL">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {}}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}