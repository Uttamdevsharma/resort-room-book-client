"use client";

import { useState, useEffect } from "react";
import { customersApi } from "@/lib/api/customers";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { ProfileSkeleton } from "@/components/dashboard/shared/CustomerSkeletons";
import { User, Phone, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  // Profile Form
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password Form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPass, setUpdatingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg(null);
    try {
      await customersApi.updateProfile({ name, phone });
      await refreshUser();
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPass(true);
    setPassMsg(null);
    try {
      await customersApi.changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setPassMsg({ type: "success", text: "Password changed successfully!" });
    } catch (err: any) {
      setPassMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Profile & Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information and login security</p>
      </div>

      {/* Profile Form */}
      <div className="p-6 bg-card border border-border rounded-2xl space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" /> Personal Information
        </h2>

        {profileMsg && (
          <div
            className={`p-3.5 rounded-xl text-sm flex items-center gap-2 ${
              profileMsg.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            {profileMsg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Email Address (Read only)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={updatingProfile}>
            {updatingProfile ? "Saving Changes..." : "Save Profile"}
          </Button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="p-6 bg-card border border-border rounded-2xl space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" /> Change Password
        </h2>

        {passMsg && (
          <div
            className={`p-3.5 rounded-xl text-sm flex items-center gap-2 ${
              passMsg.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            {passMsg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{passMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <Button type="submit" variant="primary" disabled={updatingPass}>
            {updatingPass ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </div>
        </>
      )}
    </div>
  );
}
