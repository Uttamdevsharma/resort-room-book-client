"use client";

import { useState, useEffect } from "react";
import { facilitiesApi, Facility } from "@/lib/api/facilities";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Plus, Edit2, Trash2, Palmtree } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export function FacilitiesAdminContent() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Facility | null>(null);
  const [name, setName] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await facilitiesApi.list();
      if (res.data) setFacilities(res.data);
    } catch (err) {
      console.error("Error loading facilities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setOpeningHours("07:00 AM - 10:00 PM");
    setDescription("");
    setStatus("ACTIVE");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Facility) => {
    setEditingItem(item);
    setName(item.name);
    setOpeningHours(item.openingHours || "");
    setDescription(item.description || "");
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await facilitiesApi.update(editingItem.id, { name, openingHours, description, status });
      } else {
        await facilitiesApi.create({ name, openingHours, description, status });
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save facility.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete facility?")) return;
    try {
      await facilitiesApi.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Resort Facilities</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage public pools, spas, wellness suites, dining, and operating hours</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Add Facility
        </Button>
      </div>

      {isLoading ? (
        <Loading text="Loading facilities..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Facility Name</th>
                  <th className="p-4">Opening Hours</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {facilities.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{f.name}</td>
                    <td className="p-4 font-semibold text-primary">{f.openingHours || "24/7"}</td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">{f.description || "&mdash;"}</td>
                    <td className="p-4">
                      <Badge variant={f.status === "ACTIVE" ? "success" : "danger"}>{f.status}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(f)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(f.id)}
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? "Edit Facility" : "Create Facility"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Facility Name</label>
            <input
              type="text"
              required
              placeholder="Infinity Pool, Wellness Spa, Ocean Grill..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Opening Hours</label>
            <input
              type="text"
              placeholder="08:00 AM - 10:00 PM"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
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
              {submitting ? "Saving..." : "Save Facility"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}