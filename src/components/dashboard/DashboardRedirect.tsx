"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getDefaultDashboardPath } from "@/lib/auth/roles";
import { Loading } from "@/components/ui/Loading";

interface DashboardRedirectProps {
  targetPath?: string;
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