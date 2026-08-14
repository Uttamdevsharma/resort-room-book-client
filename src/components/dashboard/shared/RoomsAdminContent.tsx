"use client";

import { useState, useEffect } from "react";
import { roomsApi, PhysicalRoom } from "@/lib/api/rooms";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { RoomsSkeleton } from "@/components/dashboard/skeletons";
import { Plus, Edit2, Trash2, DoorOpen } from "lucide-react";

export function RoomsAdminContent() {
  const [rooms, setRooms] = useState<PhysicalRoom[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [floor, setFloor] = useState("1");
  const [status, setStatus] = useState<"AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "INACTIVE">("AVAILABLE");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rRes, rtRes] = await Promise.allSettled([
        roomsApi.list(),
        roomTypesApi.list(),
      ]);
      if (rRes.status === "fulfilled" && rRes.value.data) setRooms(rRes.value.data);
      if (rtRes.status === "fulfilled" && rtRes.value.data) setRoomTypes(rtRes.value.data);
    } catch (err) {
      console.error("Error loading physical rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || !roomTypeId) return;
    setSubmitting(true);
    try {
      await roomsApi.create({
        roomNumber,
        roomTypeId,
        floor: Number(floor),
        status,
      });
      setModalOpen(false);
      setRoomNumber("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create physical room.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      await roomsApi.updateStatus(roomId, newStatus);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update room status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this physical room?")) return;
    try {
      await roomsApi.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete room.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Physical Rooms Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Track room numbers, floor layout, and current occupancy status</p>
        </div>
        <Button onClick={() => setModalOpen(true)} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Add Physical Room
        </Button>
      </div>

      {isLoading ? (
        <RoomsSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Room #</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Floor</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Quick Status Toggle</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-extrabold text-foreground text-base">#{r.roomNumber}</td>
                    <td className="p-4 font-semibold text-primary">{r.roomType?.name || "Room Suite"}</td>
                    <td className="p-4 text-muted-foreground">Floor {r.floor || 1}</td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(r.status)}>{r.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="px-2 py-1 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="OCCUPIED">OCCUPIED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(r.id)}
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

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Physical Room">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Room Number</label>
            <input
              type="text"
              required
              placeholder="e.g. 101, 202, 305"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Room Category Type</label>
            <select
              required
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="">-- Select Room Type --</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name} (৳{rt.basePrice}/night)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Floor</label>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : "Create Room"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}