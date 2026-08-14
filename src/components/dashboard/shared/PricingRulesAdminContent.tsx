"use client";

import { useState, useEffect } from "react";
import { pricingApi, PricingRule } from "@/lib/api/pricing";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { PricingRulesSkeleton } from "@/components/dashboard/skeletons";
import { Plus, Edit2, Trash2, CircleDollarSign } from "lucide-react";

export function PricingRulesAdminContent() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingRule | null>(null);
  const [name, setName] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [multiplier, setMultiplier] = useState(1.2);
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prRes, rtRes] = await Promise.allSettled([
        pricingApi.list(),
        roomTypesApi.list(),
      ]);
      if (prRes.status === "fulfilled" && prRes.value.data) setPricingRules(prRes.value.data);
      if (rtRes.status === "fulfilled" && rtRes.value.data) setRoomTypes(rtRes.value.data);
    } catch (err) {
      console.error("Error loading pricing rules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("Peak Season Surge");
    setRoomTypeId("");
    setMultiplier(1.25);
    setReason("High demand season multiplier");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0]);
    setStatus("ACTIVE");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: PricingRule) => {
    setEditingItem(item);
    setName(item.name);
    setRoomTypeId(item.roomTypeId || "");
    setMultiplier(item.multiplier);
    setReason(item.reason || "");
    setStartDate(item.startDate ? item.startDate.split("T")[0] : "");
    setEndDate(item.endDate ? item.endDate.split("T")[0] : "");
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<PricingRule> = {
        name,
        roomTypeId: roomTypeId || undefined,
        multiplier: Number(multiplier),
        reason,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        status,
      };

      if (editingItem) {
        await pricingApi.update(editingItem.id, payload);
      } else {
        await pricingApi.create(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save pricing rule.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete pricing rule?")) return;
    try {
      await pricingApi.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Seasonal Pricing Rules</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure peak season surges, weekend rates, and custom price multipliers</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Add Pricing Rule
        </Button>
      </div>

      {isLoading ? (
        <PricingRulesSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Rule Name</th>
                  <th className="p-4">Target Room</th>
                  <th className="p-4">Multiplier</th>
                  <th className="p-4">Date Range</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pricingRules.map((pr) => (
                  <tr key={pr.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{pr.name}</td>
                    <td className="p-4 font-semibold text-primary">{pr.roomType?.name || "All Rooms"}</td>
                    <td className="p-4 font-extrabold text-emerald-600">{pr.multiplier}x</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {pr.startDate ? new Date(pr.startDate).toLocaleDateString() : "Any"} &mdash;
                      {pr.endDate ? new Date(pr.endDate).toLocaleDateString() : "Any"}
                    </td>
                    <td className="p-4">
                      <Badge variant={pr.status === "ACTIVE" ? "success" : "danger"}>{pr.status}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(pr)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(pr.id)}
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
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? "Edit Pricing Rule" : "Create Pricing Rule"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Rule Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Summer Peak Multiplier, Holiday Season..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Target Room Type (Optional)</label>
            <select
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="">-- Apply to All Room Types --</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Price Multiplier (e.g. 1.2 = +20%)</label>
            <input
              type="number"
              step="0.05"
              required
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Pricing Rule"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}