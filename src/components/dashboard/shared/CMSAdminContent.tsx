"use client";

import { useState, useEffect } from "react";
import { cmsApi, HomepageSection } from "@/lib/api/cms";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Plus, Edit2, Trash2, GripVertical, Eye, LayoutDashboard } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

const SECTION_TYPES = [
  "HERO",
  "FEATURED_ROOMS",
  "FACILITIES",
  "OFFERS",
  "TESTIMONIALS",
  "FAQ",
  "GALLERY",
  "CTA",
] as const;

const SECTION_LABELS: Record<string, string> = {
  HERO: "Hero Banner",
  FEATURED_ROOMS: "Featured Rooms",
  FACILITIES: "Facilities Showcase",
  OFFERS: "Special Offers",
  TESTIMONIALS: "Guest Testimonials",
  FAQ: "Frequently Asked Questions",
  GALLERY: "Photo Gallery",
  CTA: "Call to Action",
};

export function CMSAdminContent() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomepageSection | null>(null);
  const [sectionType, setSectionType] = useState<HomepageSection["sectionType"]>("HERO");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await cmsApi.listAdminSections();
      if (res.data) setSections(res.data);
    } catch (err) {
      console.error("Error loading CMS sections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setSectionType("HERO");
    setTitle("");
    setSubtitle("");
    setContent("");
    setSortOrder(sections.length);
    setStatus("ACTIVE");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: HomepageSection) => {
    setEditingItem(item);
    setSectionType(item.sectionType);
    setTitle(item.title || "");
    setSubtitle(item.subtitle || "");
    setContent(JSON.stringify(item.content || {}, null, 2));
    setSortOrder(item.sortOrder);
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let parsedContent: any = {};
      try {
        parsedContent = content ? JSON.parse(content) : {};
      } catch {
        alert("Invalid JSON in content field");
        setSubmitting(false);
        return;
      }

      const payload: Partial<HomepageSection> = {
        sectionType,
        title: title || undefined,
        subtitle: subtitle || undefined,
        content: parsedContent,
        sortOrder,
        status,
      };

      if (editingItem) {
        await cmsApi.updateSection(editingItem.id, payload);
      } else {
        await cmsApi.createSection(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save section.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this homepage section?")) return;
    try {
      await cmsApi.deleteSection(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    }
  };

  const handleReorder = async (sectionId: string, direction: "up" | "down") => {
    const currentIndex = sections.findIndex((s) => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(currentIndex, 1);
    newSections.splice(newIndex, 0, moved);

    // Update sortOrder for all sections
    try {
      await Promise.all(
        newSections.map((s, i) =>
          cmsApi.updateSection(s.id, { sortOrder: i })
        )
      );
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to reorder.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Homepage CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage dynamic homepage sections, content blocks, and display order</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>

      {isLoading ? (
        <Loading text="Loading homepage sections..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="divide-y divide-border">
            {sections.map((s, index) => (
              <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GripVertical className="h-5 w-5 cursor-grab" />
                  <Badge variant="outline" className="text-xs">
                    {SECTION_LABELS[s.sectionType] || s.sectionType}
                  </Badge>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {s.title || "Untitled Section"}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.subtitle || "No subtitle"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={s.status === "ACTIVE" ? "success" : "danger"}>{s.status}</Badge>
                  <span className="text-xs text-muted-foreground">Order: {s.sortOrder}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReorder(s.id, "up")}
                    disabled={index === 0}
                    className="p-1 h-auto"
                    title="Move Up"
                  >
                    <LayoutDashboard className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReorder(s.id, "down")}
                    disabled={index === sections.length - 1}
                    className="p-1 h-auto"
                    title="Move Down"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(s)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(s.id)}
                    className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-1 h-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {sections.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <LayoutDashboard className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No homepage sections configured. Click "Add Section" to create your first section.</p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Homepage Section" : "Create Homepage Section"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Section Type</label>
            <select
              value={sectionType}
              onChange={(e) => setSectionType(e.target.value as HomepageSection["sectionType"])}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              {SECTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SECTION_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Title (Optional)</label>
            <input
              type="text"
              placeholder="Section headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Subtitle (Optional)</label>
            <input
              type="text"
              placeholder="Supporting text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Content (JSON)</label>
            <textarea
              rows={8}
              placeholder='{"key": "value", "items": [...]}'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
            <p className="text-xs text-muted-foreground mt-1">Valid JSON object for section-specific content</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Display Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
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
              {submitting ? "Saving..." : "Save Section"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}