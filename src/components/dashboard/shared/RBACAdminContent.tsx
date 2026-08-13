"use client";

import { useState, useEffect } from "react";
import { rbacApi, Role, Permission } from "@/lib/api/rbac";
import { customersApi, CustomerUser, CreateUserData } from "@/lib/api/customers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Input } from "@/components/ui/Input";
import { Plus, Edit2, Trash2, ShieldCheck, UserPlus, UserMinus, Search, Users, UserCog, Mail, Lock, User, AlertTriangle, RefreshCw } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

// Predefined roles available for user creation (excludes SUPER_ADMIN)
const PREDEFINED_ROLES: { name: string; label: string }[] = [
  { name: "RESORT_MANAGER", label: "Resort Manager" },
  { name: "ROOM_MANAGER", label: "Room Manager" },
  { name: "BOOKING_MANAGER", label: "Booking Manager" },
  { name: "CUSTOMER_SUPPORT", label: "Customer Support" },
  { name: "MARKETING_MANAGER", label: "Marketing Manager" },
  { name: "FINANCE", label: "Finance" },
];

export function RBACAdminContent() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"roles" | "permissions" | "users">("roles");

  // Role Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleSubmitting, setRoleSubmitting] = useState(false);

  // Assign Roles Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  // Create User Modal
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [createUserName, setCreateUserName] = useState("");
  const [createUserEmail, setCreateUserEmail] = useState("");
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserRole, setCreateUserRole] = useState(""); // role name e.g. RESORT_MANAGER
  const [createUserSubmitting, setCreateUserSubmitting] = useState(false);
  const [createUserError, setCreateUserError] = useState("");

const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rolesRes, permsRes, usersRes] = await Promise.allSettled([
        rbacApi.listRoles(),
        rbacApi.listPermissions(),
        customersApi.listCustomers(),
      ]);
      const errors: string[] = [];
      if (rolesRes.status === "fulfilled" && rolesRes.value.data) setRoles(rolesRes.value.data);
      else if (rolesRes.status === "rejected") errors.push(`Roles: ${rolesRes.reason?.message || "Failed to load"}`);
      if (permsRes.status === "fulfilled" && permsRes.value.data) setPermissions(permsRes.value.data);
      else if (permsRes.status === "rejected") errors.push(`Permissions: ${permsRes.reason?.message || "Failed to load"}`);
      if (usersRes.status === "fulfilled" && usersRes.value.data) setUsers(usersRes.value.data);
      else if (usersRes.status === "rejected") errors.push(`Users: ${usersRes.reason?.message || "Failed to load"}`);
      if (errors.length > 0 && roles.length === 0 && permissions.length === 0 && users.length === 0) {
        setError(errors.join("; "));
      }
    } catch (err) {
      console.error("Error loading RBAC data:", err);
      setError(err instanceof Error ? err.message : "Failed to load RBAC data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateUser = () => {
    setCreateUserName("");
    setCreateUserEmail("");
    setCreateUserPassword("");
    setCreateUserRole("");
    setCreateUserError("");
    setCreateUserModalOpen(true);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserSubmitting(true);
    setCreateUserError("");
    try {
      const userData: CreateUserData = {
        name: createUserName,
        email: createUserEmail,
        password: createUserPassword,
        // Send role name directly — server will upsert the role if it doesn't exist
        role: createUserRole || undefined,
      };
      const res = await customersApi.createUser(userData);
      if (res.success && res.data) {
        setCreateUserModalOpen(false);
        loadData();
      } else {
        setCreateUserError(res.message || "Failed to create user.");
      }
    } catch (err: any) {
      setCreateUserError(err.message || "Failed to create user.");
    } finally {
      setCreateUserSubmitting(false);
    }
  };

  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleName("");
    setRoleDescription("");
    setRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || "");
    setRoleModalOpen(true);
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoleSubmitting(true);
    try {
      if (editingRole) {
        await rbacApi.updateRole(editingRole.id, { name: roleName, description: roleDescription || undefined });
      } else {
        await rbacApi.createRole({ name: roleName, description: roleDescription || undefined });
      }
      setRoleModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save role.");
    } finally {
      setRoleSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm("Delete this role? This cannot be undone.")) return;
    try {
      await rbacApi.deleteRole(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete role.");
    }
  };

  const handleOpenAssignRoles = (user: CustomerUser) => {
    setSelectedUser(user);
    setSelectedRoleIds(user.roles || []);
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setAssignSubmitting(true);
    try {
      const currentRoleIds = selectedUser.roles || [];
      const toAdd = selectedRoleIds.filter((id) => !currentRoleIds.includes(id));
      const toRemove = currentRoleIds.filter((id) => !selectedRoleIds.includes(id));

      if (toAdd.length > 0) {
        await rbacApi.assignRolesToUser(selectedUser.id, toAdd);
      }
      if (toRemove.length > 0) {
        await rbacApi.removeRolesFromUser(selectedUser.id, toRemove);
      }
      setAssignModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update user roles.");
    } finally {
      setAssignSubmitting(false);
    }
  };

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  if (isLoading) {
    return <Loading text="Loading RBAC configuration..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 rounded-full">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-rose-600 dark:text-rose-400">Failed to load RBAC data</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button variant="outline" size="sm" onClick={loadData} className="mt-3 gap-1.5">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">RBAC & Roles Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure roles, permissions, and user access control</p>
        </div>
        {activeTab === "roles" && (
          <Button onClick={handleOpenCreateRole} variant="primary" className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" /> Create Role
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-2xl p-1 flex gap-1 shadow-xs">
        {[
          { id: "roles", label: "Roles", icon: ShieldCheck },
          { id: "permissions", label: "Permissions", icon: ShieldCheck },
          { id: "users", label: "User Roles", icon: Users },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="gap-1.5 font-medium px-4 py-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
        {activeTab === "users" && (
          <Button onClick={handleOpenCreateUser} variant="primary" size="sm" className="gap-1.5 ml-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
        )}
      </div>

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Role Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Users</th>
                  <th className="p-4">Permissions</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roles.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{r.name}</td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">{r.description || "&mdash;"}</td>
                    <td className="p-4 font-medium text-primary">{r._count?.userRoles || 0}</td>
                    <td className="p-4 font-medium text-primary">{r._count?.rolePermissions || 0}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEditRole(r)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRole(r.id)}
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

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border">
            <input
              type="text"
              placeholder="Filter permissions..."
              className="w-full max-w-md px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              onChange={(e) => {
                // Filter logic would go here
              }}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Permission</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {permissions.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-foreground">{p.name}</td>
                    <td className="p-4">
                      <Badge variant="outline">{p.resource}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{p.action}</Badge>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">{p.description || "&mdash;"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full max-w-md px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Current Roles</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{u.name}</td>
                    <td className="p-4 font-medium text-primary">{u.email}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles || []).map((r) => (
                          <Badge key={r} variant="outline" className="text-xs">
                            {r}
                          </Badge>
                        ))}
                        {(u.roles || []).length === 0 && (
                          <span className="text-xs text-muted-foreground">No roles assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAssignRoles(u)}
                        className="gap-1.5"
                      >
                        <UserPlus className="h-3 w-3" />
                        Manage Roles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Role Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={editingRole ? "Edit Role" : "Create New Role"}
      >
        <form onSubmit={handleRoleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Role Name</label>
            <input
              type="text"
              required
              placeholder="e.g. FRONT_DESK, HOUSEKEEPING"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Role description and responsibilities"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={roleSubmitting}>
              {roleSubmitting ? "Saving..." : "Save Role"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Roles Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Manage User Roles"
        size="xl"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            User: <strong className="text-foreground">{selectedUser?.name}</strong> ({selectedUser?.email})
          </p>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Assign Roles</label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3">
              {roles.map((r) => (
                <label key={r.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(r.id)}
                    onChange={() => toggleRoleSelection(r.id)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{r.name}</span>
                  {r.description && <span className="text-xs text-muted-foreground">- {r.description}</span>}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={assignSubmitting}>
              {assignSubmitting ? "Saving..." : "Update Roles"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={createUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateUserSubmit} className="space-y-4">
          {createUserError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
              {createUserError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Full Name</label>
            <Input
              type="text"
              required
              placeholder="John Doe"
              value={createUserName}
              onChange={(e) => setCreateUserName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Email Address</label>
            <Input
              type="email"
              required
              placeholder="user@example.com"
              value={createUserEmail}
              onChange={(e) => setCreateUserEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Password</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={createUserPassword}
              onChange={(e) => setCreateUserPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Role</label>
            <select
              value={createUserRole}
              onChange={(e) => setCreateUserRole(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="">Select a role (optional — defaults to CUSTOMER)</option>
              {PREDEFINED_ROLES.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">SUPER_ADMIN is excluded. Role will be created automatically if it does not yet exist.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setCreateUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={createUserSubmitting}>
              {createUserSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}