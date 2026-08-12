"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Loading } from "@/components/ui/Loading";

interface DashboardRedirectProps {
  targetPath?: string;
}

function getDefaultDashboardPath(roles: string[]): string {
  if (roles.includes("SUPER_ADMIN")) return "/admin/dashboard";
  if (roles.includes("RESORT_MANAGER")) return "/resort-manager/dashboard";
  if (roles.includes("ROOM_MANAGER")) return "/room-manager/dashboard";
  if (roles.includes("BOOKING_MANAGER")) return "/booking-manager/dashboard";
  if (roles.includes("CUSTOMER_SUPPORT")) return "/customer-support/dashboard";
  if (roles.includes("MARKETING_MANAGER")) return "/marketing-manager/dashboard";
  if (roles.includes("FINANCE")) return "/finance/dashboard";
  return "/login";
}

export function DashboardRedirect({ targetPath }: DashboardRedirectProps) {
  const { roles, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const basePath = targetPath || getDefaultDashboardPath(roles);
      router.push(basePath);
    }
  }, [roles, isLoading, router, targetPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loading size="lg" text="Redirecting..." />
    </div>
  );
}