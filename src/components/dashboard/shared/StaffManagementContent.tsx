"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { customersApi, CustomerUser, CreateUserData } from "@/lib/api/customers";
import { rbacApi, Role } from "@/lib/api/rbac";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/context/AuthContext";
import { StaffManagementSkeleton } from "@/components/dashboard/skeletons";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCog,
  Users,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const PREDEFINED_ROLES: { name: string; label: string }[] = [
  { name: "RESORT_MANAGER", label: "Resort Manager" },
  { name: "ROOM_MANAGER", label: "Room Manager" },
  { name: "BOOKING_MANAGER", label: "Booking Manager" },
  { name: "CUSTOMER_SUPPORT", label: "Customer Support" },
  { name: "MARKETING_MANAGER", label: "Marketing Manager" },
  { name: "FINANCE", label: "Finance" },
];

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  RESORT_MANAGER: "Resort Manager",
  ROOM_MANAGER: "Room Manager",
  BOOKING_MANAGER: "Booking Manager",
  CUSTOMER_SUPPORT: "Customer Support",
  MARKETING_MANAGER: "Marketing Manager",
  FINANCE: "Finance",
  CUSTOMER: "Customer",
};

function roleLabel(name?: string): string {
  if (!name) return "—";
  return ROLE_LABELS[name] || name.replace(/_/g, " ");
}

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function StaffManagementContent() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<CustomerUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Create Staff modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit Staff modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<CustomerUser | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customersApi.listCustomers({ staffOnly: true, limit: 100 });
      if (res.data) setStaff(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load staff.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRoles = useCallback(async () => {
    try {
      const res = await rbacApi.listRoles();
      if (res.data) setRoles(res.data);
    } catch {
      // Role list is only needed for editing; ignore failures here.
    }
  }, []);

  useEffect(() => {
    loadStaff();
    loadRoles();
  }, [loadStaff, loadRoles]);

  const filteredStaff = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return staff;
    return staff.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        (s.roles || []).some((r) => r.toLowerCase().includes(term))
    );
  }, [staff, search]);

  const isSuperAdmin = (staffMember: CustomerUser) =>
    (staffMember.roles || []).includes("SUPER_ADMIN");

  const isSelf = (staffMember: CustomerUser) => staffMember.id === user?.id;

  const canManage = (staffMember: CustomerUser) =>
    !isSuperAdmin(staffMember) && !isSelf(staffMember);

  const openCreateModal = () => {
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateRole("");
    setCreateError("");
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setCreateError("");
    try {
      const data: CreateUserData = {
        name: createName,
        email: createEmail,
        password: createPassword,
        role: createRole || undefined,
      };
      const res = await customersApi.createUser(data);
      if (res.success && res.data) {
        setCreateModalOpen(false);
        loadStaff();
      } else {
        setCreateError(res.message || "Failed to create staff member.");
      }
    } catch (err: any) {
      setCreateError(err.message || "Failed to create staff member.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEditModal = (staffMember: CustomerUser) => {
    const currentRole = (staffMember.roles || [])[0] || "";
    setEditStaff(staffMember);
    setEditRole(currentRole);
    setEditError("");
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaff || !editRole) return;
    setEditSubmitting(true);
    setEditError("");
    try {
      const roleIdByName = new Map(roles.map((r) => [r.name, r.id]));
      const currentRoleIds = (editStaff.roles || [])
        .map((name) => roleIdByName.get(name))
        .filter(Boolean) as string[];
      if (currentRoleIds.length > 0) {
        await rbacApi.removeRolesFromUser(editStaff.id, currentRoleIds);
      }
      const targetRoleId = roleIdByName.get(editRole);
      if (targetRoleId) {
        await rbacApi.assignRolesToUser(editStaff.id, [targetRoleId]);
      }
      setEditModalOpen(false);
      loadStaff();
    } catch (err: any) {
      setEditError(err.message || "Failed to update staff role.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (staffMember: CustomerUser) => {
    if (!canManage(staffMember)) return;
    if (!window.confirm(`Delete ${staffMember.name}? This will permanently remove their account and they will no longer be able to log in.`)) return;
    setDeletingId(staffMember.id);
    try {
      await customersApi.deleteUser(staffMember.id);
      setStaff((prev) => prev.filter((s) => s.id !== staffMember.id));
    } catch (err: any) {
      alert(err.message || "Failed to delete staff member.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <StaffManagementSkeleton />;
  }

  if (error && staff.length === 0) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 rounded-full">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-rose-600 dark:text-rose-400">Failed to load staff members</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button variant="outline" size="sm" onClick={loadStaff} className="mt-3 gap-1.5">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage staff members, assign roles, and control dashboard access
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" />
          Create Staff
        </Button>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="p-4 bg-card border border-border rounded-2xl flex gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>
      </form>

      {filteredStaff.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title={staff.length === 0 ? "No staff members yet" : "No staff found"}
            description={
              staff.length === 0
                ? "Create your first staff member to grant them access to their role-specific dashboard."
                : "No staff members match your current search."
            }
            action={
              staff.length === 0
                ? { label: "Create Staff", onClick: openCreateModal }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStaff.map((s) => {
                  const manage = canManage(s);
                  return (
                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                            {getInitials(s.name)}
                          </div>
                          <span className="font-semibold text-foreground">{s.name}</span>
                          {isSelf(s) && (
                            <Badge variant="outline" size="sm" className="shrink-0">You</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-primary">{s.email}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(s.roles || []).map((r) => (
                            <Badge key={r} variant="primary" size="sm">
                              {roleLabel(r)}
                            </Badge>
                          ))}
                          {(s.roles || []).length === 0 && (
                            <span className="text-xs text-muted-foreground">No role assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!manage}
                          onClick={() => openEditModal(s)}
                          title={manage ? "Edit staff role" : "This member cannot be edited"}
                          className="gap-1.5"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!manage || deletingId === s.id}
                          loading={deletingId === s.id}
                          onClick={() => handleDelete(s)}
                          title={manage ? "Delete staff member" : "This member cannot be deleted"}
                          className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
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

      {/* Create Staff Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Staff"
        description="Create a staff account and grant access to their role-specific dashboard."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {createError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
              {createError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Full Name</label>
            <Input
              type="text"
              required
              placeholder="e.g. Jane Smith"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Email Address</label>
            <Input
              type="email"
              required
              placeholder="staff@coxbayresort.com"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Password</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Assigned Role</label>
            <select
              required
              value={createRole}
              onChange={(e) => setCreateRole(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="" disabled>
                Select a role
              </option>
              {PREDEFINED_ROLES.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              The staff member will be able to log in and access their assigned role dashboard.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={createSubmitting} className="gap-1.5">
              <UserCog className="h-4 w-4" />
              {createSubmitting ? "Creating..." : "Create Staff"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Staff Member"
        description={editStaff ? `Update the role for ${editStaff.name}` : "Update staff role"}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {editError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
              {editError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Full Name</label>
            <Input type="text" value={editStaff?.name || ""} disabled />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Email Address</label>
            <Input type="email" value={editStaff?.email || ""} disabled />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Assigned Role</label>
            <select
              required
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="" disabled>
                Select a role
              </option>
              {PREDEFINED_ROLES.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={editSubmitting || !editRole}>
              {editSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
