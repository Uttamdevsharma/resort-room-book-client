import { apiRequest } from "./client";

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  _count?: { userRoles: number; rolePermissions: number };
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string | null;
}

export const rbacApi = {
  async getMyPermissions(userId: string) {
    return apiRequest<{ id: string; name: string; email: string; roles: string[]; permissions: Permission[] }>(
      `/rbac/users/${userId}/permissions`
    );
  },

  async listRoles() {
    return apiRequest<Role[]>("/rbac/roles");
  },

  async getRole(roleId: string) {
    return apiRequest<Role>(`/rbac/roles/${roleId}`);
  },

  async createRole(data: { name: string; description?: string }) {
    return apiRequest<Role>("/rbac/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateRole(roleId: string, data: { name?: string; description?: string }) {
    return apiRequest<Role>(`/rbac/roles/${roleId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteRole(roleId: string) {
    return apiRequest(`/rbac/roles/${roleId}`, { method: "DELETE" });
  },

  async listPermissions(resource?: string) {
    const query = resource ? `?resource=${encodeURIComponent(resource)}` : "";
    return apiRequest<Permission[]>(`/rbac/permissions${query}`);
  },

  async assignRolesToUser(userId: string, roleIds: string[]) {
    return apiRequest(`/rbac/users/${userId}/roles`, {
      method: "POST",
      body: JSON.stringify({ roleIds }),
    });
  },

  async removeRolesFromUser(userId: string, roleIds: string[]) {
    return apiRequest(`/rbac/users/${userId}/roles`, {
      method: "DELETE",
      body: JSON.stringify({ roleIds }),
    });
  },
};
