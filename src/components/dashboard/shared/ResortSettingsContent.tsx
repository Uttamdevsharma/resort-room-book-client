"use client";

import { useState, useEffect } from "react";
import { resortApi, ResortSettings } from "@/lib/api/resort";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { Building2, Save, CheckCircle2, AlertCircle } from "lucide-react";

export function ResortSettingsContent() {
  const [settings, setSettings] = useState<Partial<ResortSettings>>({
    resortName: "ResortStay Luxury Resort & Spa",
    tagline: "Your Private Paradise",
    description: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    currency: "USD",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Full refund if cancelled 48h before check-in.",
  });
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await resortApi.getSettings();
        if (res.data) {
          setSettings(res.data);
          setSettingsId(res.data.id);
        }
      } catch (err) {
        console.error("Error loading resort settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      if (settingsId) {
        await resortApi.updateSettings(settingsId, settings);
      } else {
        const createRes = await resortApi.createSettings(settings);
        if (createRes.data?.id) setSettingsId(createRes.data.id);
      }
      setMsg({ type: "success", text: "Resort settings updated successfully!" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <Loading text="Loading resort configuration..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Resort Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure resort profile, currency, policy, and contact details</p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            msg.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Resort Name</label>
            <input
              type="text"
              required
              value={settings.resortName || ""}
              onChange={(e) => setSettings({ ...settings, resortName: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline || ""}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.email || ""}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Contact Phone</label>
            <input
              type="text"
              value={settings.phone || ""}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Default Currency</label>
            <input
              type="text"
              value={settings.currency || "USD"}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Website URL</label>
            <input
              type="text"
              value={settings.website || ""}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Check-In Time</label>
            <input
              type="text"
              placeholder="15:00"
              value={settings.checkInTime || ""}
              onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Check-Out Time</label>
            <input
              type="text"
              placeholder="11:00"
              value={settings.checkOutTime || ""}
              onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Cancellation Policy</label>
          <textarea
            rows={3}
            value={settings.cancellationPolicy || ""}
            onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>

        <Button type="submit" variant="primary" disabled={saving} className="gap-2 font-bold">
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving Changes..." : "Save Resort Settings"}</span>
        </Button>
      </form>
    </div>
  );
}