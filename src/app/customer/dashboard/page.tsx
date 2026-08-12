"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/Loading";

export default function CustomerDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/customer/bookings");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loading size="lg" text="Redirecting to your bookings..." />
    </div>
  );
}