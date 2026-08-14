"use client";

import { useState, useEffect } from "react";
import { amenitiesApi, Amenity } from "@/lib/api/amenities";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { AmenitiesSkeleton } from "@/components/dashboard/skeletons";
import { Plus, Edit2, Trash2, Sparkles } from "lucide-react";

export function AmenitiesAdminContent() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Amenity | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await amenitiesApi.list();
      if (res.data) setAmenities(res.data);
    } catch (err) {
      console.error("Error loading amenities:", err);
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
    setCategory("General");
    setDescription("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: Amenity) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category || "General");
    setDescription(item.description || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await amenitiesApi.update(editingItem.id, { name, category, description });
      } else {
        await amenitiesApi.create({ name, category, description });
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save amenity.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this amenity?")) return;
    try {
      await amenitiesApi.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Amenities Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure room features, high-speed Wi-Fi, Jacuzzi, minibars, etc.</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Add Amenity
        </Button>
      </div>

      {isLoading ? (
        <AmenitiesSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Amenity Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {amenities.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{a.name}</td>
                    <td className="p-4 font-semibold text-primary">{a.category || "General"}</td>
                    <td className="p-4 text-xs text-muted-foreground">{a.description || "&mdash;"}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(a)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(a.id)}
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? "Edit Amenity" : "Create Amenity"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Amenity Name</label>
            <input
              type="text"
              required
              placeholder="Ocean View Balcony, King Jacuzzi, Wi-Fi 6..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Category</label>
            <input
              type="text"
              placeholder="Comfort, Bathroom, Entertainment..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Amenity"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}