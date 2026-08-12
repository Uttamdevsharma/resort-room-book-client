"use client";

import { useState, useEffect } from "react";
import { rbacApi, Role, Permission } from "@/lib/api/rbac";
import { customersApi, CustomerUser } from "@/lib/api/customers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Plus, Edit2, Trash2, ShieldCheck, UserPlus, UserMinus, Search, Users } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export function RBACAdminContent() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, permsRes, usersRes] = await Promise.allSettled([
        rbacApi.listRoles(),
        rbacApi.listPermissions(),
        customersApi.listCustomers(),
      ]);
      if (rolesRes.status === "fulfilled" && rolesRes.value.data) setRoles(rolesRes.value.data);
      if (permsRes.status === "fulfilled" && permsRes.value.data) setPermissions(permsRes.value.data);
      if (usersRes.status === "fulfilled" && usersRes.value.data) setUsers(usersRes.value.data);
    } catch (err) {
      console.error("Error loading RBAC data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    </div>
  );
}