"use client";

import { useState, useEffect } from "react";
import { customersApi, CustomerUser } from "@/lib/api/customers";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Users, Search, ShieldAlert } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { useAuth } from "@/lib/context/AuthContext";

export function CustomersAdminContent() {
  const { user, roles } = useAuth();
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const isStaff = roles.includes("SUPER_ADMIN") || roles.includes("RESORT_MANAGER") ||
    roles.includes("ROOM_MANAGER") || roles.includes("BOOKING_MANAGER") ||
    roles.includes("CUSTOMER_SUPPORT") || roles.includes("MARKETING_MANAGER") ||
    roles.includes("FINANCE");

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await customersApi.listCustomers({ search: search || undefined });
      if (res.data) setCustomers(res.data);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleStatusToggle = async (userId: string, newStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
    try {
      await customersApi.updateCustomerStatus(userId, newStatus);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || "Failed to update customer status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Customer Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage registered guests, verify accounts, and toggle access status</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchCustomers();
        }}
        className="p-4 bg-card border border-border rounded-2xl flex gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>

      {isLoading ? (
        <Loading text="Loading customers..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{c.name}</td>
                    <td className="p-4 font-medium text-primary">{c.email}</td>
                    <td className="p-4 text-xs text-muted-foreground">{c.phone || "&mdash;"}</td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(c.status)}>{c.status || "ACTIVE"}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {c.status === "ACTIVE" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusToggle(c.id, "SUSPENDED")}
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        >
                          Suspend Account
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusToggle(c.id, "ACTIVE")}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          Activate Account
                        </Button>
                      )}
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