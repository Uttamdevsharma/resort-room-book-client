"use client";

import { useState, useEffect } from "react";
import { couponsApi, Coupon } from "@/lib/api/coupons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Plus, Edit2, Trash2, Ticket, Copy } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export function CouponsAdminContent() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState(10);
  const [minBookingAmount, setMinBookingAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await couponsApi.listCouponsAdmin();
      if (res.data) setCoupons(res.data);
    } catch (err) {
      console.error("Error loading coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue(10);
    setMinBookingAmount("");
    setMaxDiscountAmount("");
    setValidFrom(new Date().toISOString().split("T")[0]);
    setValidUntil(new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0]);
    setUsageLimit("");
    setStatus("ACTIVE");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Coupon) => {
    setEditingItem(item);
    setCode(item.code);
    setDiscountType(item.discountType);
    setDiscountValue(item.discountValue);
    setMinBookingAmount(String(item.minBookingAmount || ""));
    setMaxDiscountAmount(String(item.maxDiscountAmount || ""));
    setValidFrom(item.validFrom ? item.validFrom.split("T")[0] : "");
    setValidUntil(item.validUntil ? item.validUntil.split("T")[0] : "");
    setUsageLimit(String(item.usageLimit || ""));
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Coupon> = {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minBookingAmount: minBookingAmount ? Number(minBookingAmount) : undefined,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        validFrom: validFrom ? new Date(validFrom).toISOString() : undefined,
        validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        status,
      };

      if (editingItem) {
        await couponsApi.updateCoupon(editingItem.id, payload);
      } else {
        await couponsApi.createCoupon(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await couponsApi.deleteCoupon(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    }
  };

  const copyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    alert(`Copied: ${couponCode}`);
  };

  const getDiscountLabel = (coupon: Coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}% OFF`;
    }
    return `$${coupon.discountValue} OFF`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Coupons & Promotions</h1>
          <p className="text-sm text-muted-foreground mt-1">Create discount codes, seasonal offers, and promotional campaigns</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {isLoading ? (
        <Loading text="Loading coupons..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min Booking</th>
                  <th className="p-4">Max Discount</th>
                  <th className="p-4">Validity</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono text-sm font-bold text-foreground flex items-center gap-2">
                      {c.code}
                      <Button size="sm" variant="ghost" onClick={() => copyCode(c.code)} className="p-1 h-auto">
                        <Copy className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </Button>
                    </td>
                    <td className="p-4 font-semibold text-primary">{getDiscountLabel(c)}</td>
                    <td className="p-4 text-xs text-muted-foreground">{c.minBookingAmount ? `$${c.minBookingAmount}` : "&mdash;"}</td>
                    <td className="p-4 text-xs text-muted-foreground">{c.maxDiscountAmount ? `$${c.maxDiscountAmount}` : "&mdash;"}</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {c.validFrom ? new Date(c.validFrom).toLocaleDateString() : "Any"} &mdash;
                      {c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "Any"}
                    </td>
                    <td className="p-4 font-medium text-foreground">{c.usedCount} / {c.usageLimit || "&infin;"}</td>
                    <td className="p-4">
                      <Badge variant={c.status === "ACTIVE" ? "success" : "danger"}>{c.status}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(c)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(c.id)}
                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {coupons.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No coupons created yet. Click "Create Coupon" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Coupon" : "Create New Coupon"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. SUMMER20, WELCOME50"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Discount Value</label>
              <input
                type="number"
                step={discountType === "PERCENTAGE" ? "1" : "0.01"}
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Min Booking Amount</label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={minBookingAmount}
                onChange={(e) => setMinBookingAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Max Discount Amount</label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional (for % only)"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Valid From</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Usage Limit</label>
              <input
                type="number"
                placeholder="Unlimited"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Coupon"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}