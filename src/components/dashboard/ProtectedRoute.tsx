"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/Loading";
import { getDefaultDashboardPath } from "@/lib/auth/roles";
import dynamic from "next/dynamic";

const ForbiddenPage = dynamic(() => import("@/app/admin/dashboard/forbidden/page").then((mod) => mod.default), {
  ssr: false,
  loading: () => <Loading text="Loading..." />,
});

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  requireStaff?: boolean;
  fallbackPath?: string;
  redirectToDefault?: boolean;
}

export function ProtectedRoute({
  children,
  roles = [],
  permissions = [],
  requireStaff = false,
  fallbackPath = "/login",
  redirectToDefault = true,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isStaff, hasRole, hasPermission, roles: userRoles } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showForbidden, setShowForbidden] = useState(false);
  const [forbiddenReason, setForbiddenReason] = useState("");

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      if (requireStaff && !isStaff) {
        setShowForbidden(true);
        setForbiddenReason("Staff access required. Your account does not have staff privileges.");
        return;
      }

      if (roles.length > 0 && !hasRole(roles)) {
        if (redirectToDefault) {
          const defaultPath = getDefaultDashboardPath(userRoles);
          if (pathname !== defaultPath) {
            router.push(defaultPath);
          }
        } else {
          setShowForbidden(true);
          setForbiddenReason(`Access requires one of these roles: ${roles.join(", ")}`);
        }
        return;
      }

      if (permissions.length > 0 && !hasPermission(permissions)) {
        setShowForbidden(true);
        setForbiddenReason(`Access requires specific permissions: ${permissions.join(", ")}`);
        return;
      }

      setShowForbidden(false);
    }
  }, [isLoading, isAuthenticated, isStaff, roles, permissions, requireStaff, fallbackPath, router, hasRole, hasPermission, userRoles, pathname, redirectToDefault]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading size="lg" text="Verifying credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (showForbidden) {
    return <ForbiddenPage reason={forbiddenReason} />;
  }

  return <>{children}</>;
}