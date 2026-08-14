"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api/client";
import { roomTypesApi, RoomType, RoomTypeMedia, normalizeMedia } from "@/lib/api/roomTypes";
import { useAuth } from "@/lib/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { RoomTypesSkeleton } from "@/components/dashboard/skeletons";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  ChevronUp,
  ChevronDown,
  ImagePlus,
  X,
} from "lucide-react";

const BED_TYPES = ["SINGLE", "DOUBLE", "TWIN", "QUEEN", "KING", "BUNK", "SOFA_BED", "KING_TWIN"];
const STATUSES = ["ACTIVE", "INACTIVE"];
const MAX_IMAGES = 10;

const inputClass =
  "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden";

interface FormImage {
  key: string;
  url?: string;
  dataUrl?: string;
  roomTypeMediaId?: string;
  altText?: string | null;
  isPrimary: boolean;
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });

export function RoomTypesAdminContent() {
  const { roles } = useAuth();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoomType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    maxAdults: "",
    maxChildren: "",
    bedType: "QUEEN",
    bedCount: "",
    roomSize: "",
    viewType: "",
    featured: false,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [images, setImages] = useState<FormImage[]>([]);

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      basePrice: "",
      maxAdults: "",
      maxChildren: "",
      bedType: "QUEEN",
      bedCount: "",
      roomSize: "",
      viewType: "",
      featured: false,
      status: "ACTIVE",
    });
    setImages([]);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RoomType) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      basePrice: String(item.basePrice ?? ""),
      maxAdults: String(item.maxAdults ?? ""),
      maxChildren: String(item.maxChildren ?? ""),
      bedType: item.bedType,
      bedCount: String(item.bedCount ?? ""),
      roomSize: item.roomSize ?? "",
      viewType: item.viewType ?? "",
      featured: item.featured ?? false,
      status: item.status,
    });
    setImages(
      (item.media ?? []).map((m) => ({
        key: m.roomTypeMediaId,
        url: m.url,
        roomTypeMediaId: m.roomTypeMediaId,
        altText: m.altText,
        isPrimary: m.isPrimary,
      })),
    );
    setIsModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const available = MAX_IMAGES - images.length;
    const selected = files.slice(0, Math.max(0, available));
    if (selected.length === 0) {
      alert(`You can upload at most ${MAX_IMAGES} images.`);
      return;
    }

    try {
      const newImages = await Promise.all(
        selected.map(async (file) => {
          const dataUrl = await readFileAsDataUrl(file);
          return { key: `${Date.now()}-${Math.random()}`, dataUrl, isPrimary: false };
        }),
      );

      setImages((prev) => {
        const merged = [...prev, ...newImages];
        const hasPrimary = merged.some((img) => img.isPrimary);
        if (!hasPrimary && merged.length > 0) {
          merged[0] = { ...merged[0], isPrimary: true };
        }
        return merged;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to read image file.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (key: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.key === key);
      const next = prev.filter((img) => img.key !== key);
      if (target?.isPrimary && next.length > 0) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
  };

  const handleSetPrimary = (key: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.key === key })),
    );
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const saveMedia = async (roomTypeId: string) => {
    const keptExistingIds = new Set(
      images
        .map((img) => img.roomTypeMediaId)
        .filter((id): id is string => Boolean(id)),
    );

    // Delete images removed by the user.
    if (editingItem?.media) {
      const removed = editingItem.media.filter(
        (m) => !keptExistingIds.has(m.roomTypeMediaId),
      );
      for (const m of removed) {
        await roomTypesApi.deleteMedia(roomTypeId, m.roomTypeMediaId);
      }
    }

    if (images.length === 0) return;

    // Upload new images (no sortOrder/isPrimary so the backend appends them).
    const newImages = images.filter((img) => !img.roomTypeMediaId);
    let newIds: string[] = [];
    if (newImages.length > 0) {
      const res = await roomTypesApi.uploadMedia(
        roomTypeId,
        newImages.map((img) => ({
          dataUrl: img.dataUrl!,
          altText: img.altText ?? null,
        })),
      );
      const full = normalizeMedia(res.data?.roomTypeMedia ?? []);
      const existingSet = new Set(
        full
          .map((m) => m.roomTypeMediaId)
          .filter((id) => keptExistingIds.has(id)),
      );
      newIds = full
        .filter((m) => !existingSet.has(m.roomTypeMediaId))
        .map((m) => m.roomTypeMediaId);
    }

    // Build the final desired order + primary, then persist it.
    const ordered: {
      roomTypeMediaId: string;
      isPrimary: boolean;
      sortOrder: number;
    }[] = [];
    let newIndex = 0;
    images.forEach((img, index) => {
      const roomTypeMediaId = img.roomTypeMediaId ?? newIds[newIndex];
      if (!roomTypeMediaId) return;
      if (!img.roomTypeMediaId) newIndex += 1;
      ordered.push({
        roomTypeMediaId,
        isPrimary: img.isPrimary,
        sortOrder: index,
      });
    });

    if (ordered.length > 0) {
      await roomTypesApi.updateMediaOrder(roomTypeId, ordered);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<RoomType> = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        basePrice: form.basePrice === "" ? undefined : Number(form.basePrice),
        maxAdults: form.maxAdults === "" ? undefined : Number(form.maxAdults),
        maxChildren: form.maxChildren === "" ? undefined : Number(form.maxChildren),
        bedType: form.bedType,
        bedCount: form.bedCount === "" ? undefined : Number(form.bedCount),
        roomSize: form.roomSize || undefined,
        viewType: form.viewType || undefined,
        featured: form.featured,
        status: form.status,
      };

      let roomTypeId = editingItem?.id;
      if (editingItem) {
        await roomTypesApi.update(editingItem.id, payload);
      } else {
        const created = await roomTypesApi.create(payload);
        roomTypeId = created.data?.id;
      }

      if (roomTypeId) {
        await saveMedia(roomTypeId);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to save room type.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this room type?")) return;
    try {
      await roomTypesApi.delete(id);
      fetchData();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete room type.");
    }
  };

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

  const getPrimaryImage = (rt: RoomType): RoomTypeMedia | undefined =>
    rt.media?.find((m) => m.isPrimary) ?? rt.media?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Room Types</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage suite categories, base pricing, and amenities</p>
        </div>
        {isStaff && (
          <Button onClick={handleOpenCreate} variant="primary" className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" /> Add Room Type
          </Button>
        )}
      </div>

      {isLoading ? (
        <RoomTypesSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Bed Type</th>
                  <th className="p-4">Max Guests</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roomTypes.map((rt) => {
                  const primary = getPrimaryImage(rt);
                  return (
                    <tr key={rt.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        {primary ? (
                          <img
                            src={primary.url}
                            alt={rt.name}
                            className="h-12 w-16 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="h-12 w-16 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground">
                            <ImagePlus className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-foreground">{rt.name}</span>
                        <Link href={`/rooms/${rt.id}`} className="block text-xs text-primary hover:underline mt-0.5">
                          View details →
                        </Link>
                      </td>
                      <td className="p-4 font-semibold text-primary">{rt.bedType}</td>
                      <td className="p-4">{rt.maxGuests} Guests</td>
                      <td className="p-4 font-extrabold text-foreground">৳{rt.basePrice}</td>
                      <td className="p-4">
                        <Badge variant={rt.status === "ACTIVE" ? "success" : "danger"}>{rt.status}</Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(rt)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(rt.id)}
                          className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Room Type" : "Add Room Type"}
        description={editingItem ? "Update the details for this room type." : "Create a new room type for your resort."}
        size="full"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Name *</label>
            <input
              type="text"
              required
              placeholder="Ocean View Suite"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Slug</label>
            <input
              type="text"
              placeholder="ocean-view-suite"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Bed Type</label>
              <select
                value={form.bedType}
                onChange={(e) => updateField("bedType", e.target.value)}
                className={inputClass}
              >
                {BED_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Bed Count</label>
              <input
                type="number"
                min={0}
                max={20}
                placeholder="1"
                value={form.bedCount}
                onChange={(e) => updateField("bedCount", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Max Adults</label>
              <input
                type="number"
                min={0}
                max={50}
                placeholder="2"
                value={form.maxAdults}
                onChange={(e) => updateField("maxAdults", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Max Children</label>
              <input
                type="number"
                min={0}
                max={50}
                placeholder="2"
                value={form.maxChildren}
                onChange={(e) => updateField("maxChildren", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Base Price (৳)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="12500.00"
                value={form.basePrice}
                onChange={(e) => updateField("basePrice", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Room Size</label>
              <input
                type="text"
                placeholder="e.g. 520 sq. ft."
                value={form.roomSize}
                onChange={(e) => updateField("roomSize", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">View Type</label>
              <input
                type="text"
                placeholder="Ocean View"
                value={form.viewType}
                onChange={(e) => updateField("viewType", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                Images ({images.length}/{MAX_IMAGES})
              </label>
              {images.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  Sort with the arrows, mark a primary with the star.
                </span>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                {images.map((img, index) => (
                  <div
                    key={img.key}
                    className={`relative rounded-xl overflow-hidden border bg-muted ${
                      img.isPrimary ? "border-primary ring-2 ring-primary/30" : "border-border"
                    }`}
                  >
                    <img
                      src={img.url ?? img.dataUrl}
                      alt={img.altText ?? "Room type image"}
                      className="h-32 w-full object-cover"
                    />
                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary text-white text-[10px] font-bold px-2 py-0.5 shadow">
                        <Star className="h-3 w-3 fill-current" /> Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.key)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center justify-between bg-card border-t border-border px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.key)}
                        className={`text-xs font-semibold inline-flex items-center gap-1 ${
                          img.isPrimary ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${img.isPrimary ? "fill-current" : ""}`} />
                        Primary
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, -1)}
                          disabled={index === 0}
                          className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                          aria-label="Move image left"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, 1)}
                          disabled={index === images.length - 1}
                          className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                          aria-label="Move image right"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={images.length >= MAX_IMAGES}
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <ImagePlus className="h-4 w-4" /> Upload Images
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Upload up to {MAX_IMAGES} images (JPG, PNG, WEBP). The primary image is shown first on the public room pages.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Describe this room type..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Featured room type
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : editingItem ? "Save Changes" : "Create Room Type"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}