"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authApi, UserProfile } from "@/lib/api/auth";
import { rbacApi, Permission } from "@/lib/api/rbac";
import { getStoredToken, clearStoredTokens } from "@/lib/api/client";
import { STAFF_ROLES } from "@/lib/auth/roles";

interface AuthResult {
  success: boolean;
  error?: string;
  roles?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  roles: string[];
  permissions: Permission[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: { email: string; password: string }) => Promise<AuthResult>;
  register: (data: { name: string; email: string; password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserData = useCallback(async (): Promise<string[]> => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setRoles([]);
      setPermissions([]);
      setIsLoading(false);
      return [];
    }

    try {
      const meRes = await authApi.getMe();
      if (meRes.success && meRes.data) {
        const userObj = meRes.data;
        const meRoles = userObj.roles || [];
        setUser(userObj);
        setRoles(meRoles);

        // Fetch user RBAC roles and permissions
        try {
          const rbacRes = await rbacApi.getMyPermissions(userObj.id);
          if (rbacRes.success && rbacRes.data) {
            if (rbacRes.data.roles && rbacRes.data.roles.length > 0) {
              setRoles(rbacRes.data.roles);
            }
            setPermissions(rbacRes.data.permissions || []);
          } else {
            setPermissions([]);
          }
        } catch {
          // If user has no specific permissions assigned yet
          setPermissions([]);
        }

        return meRoles;
      } else {
        clearStoredTokens();
        setUser(null);
        setRoles([]);
        setPermissions([]);
      }
    } catch {
      clearStoredTokens();
      setUser(null);
      setRoles([]);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
    return [];
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const login = async (data: { email: string; password: string }): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.success && res.data?.tokens) {
        const roles = await fetchUserData();
        return { success: true, roles };
      }
      return { success: false, error: res.message || "Login failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Invalid credentials. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string }): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.success && res.data?.tokens) {
        const roles = await fetchUserData();
        return { success: true, roles };
      }
      return { success: false, error: res.message || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : undefined;
      await authApi.logout(refreshToken || undefined);
    } catch {
      // Ignore logout errors
    } finally {
      clearStoredTokens();
      setUser(null);
      setRoles([]);
      setPermissions([]);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const hasRole = (role: string | string[]) => {
    if (roles.includes("SUPER_ADMIN")) return true;
    if (Array.isArray(role)) {
      return role.some((r) => roles.includes(r));
    }
    return roles.includes(role);
  };

  const hasPermission = (permission: string | string[]) => {
    if (roles.includes("SUPER_ADMIN")) return true;
    const permNames = permissions.map((p) => p.name);
    if (Array.isArray(permission)) {
      return permission.some((p) => permNames.includes(p));
    }
    return permNames.includes(permission);
  };

  const isStaff = roles.some((r) => STAFF_ROLES.includes(r));

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        permissions,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        hasRole,
        hasPermission,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
