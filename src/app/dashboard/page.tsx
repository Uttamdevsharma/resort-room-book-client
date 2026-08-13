"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getDefaultDashboardPath } from "@/lib/auth/roles";
import { Loading } from "@/components/ui/Loading";

export default function DashboardRedirect() {
  const { roles, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const targetPath = getDefaultDashboardPath(roles);
      router.push(targetPath);
    }
  }, [roles, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loading size="lg" text="Redirecting to your dashboard..." />
    </div>
  );
}