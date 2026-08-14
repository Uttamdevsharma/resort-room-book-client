"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredTokens, clearStoredTokens } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";
import { getDefaultDashboardPath } from "@/lib/auth/roles";
import { Loading } from "@/components/ui/Loading";

export function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [asyncError, setAsyncError] = useState<string | null>(null);

  const error = errorParam ? decodeURIComponent(errorParam) : asyncError;

  useEffect(() => {
    if (errorParam) {
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      router.replace("/login?error=Authentication failed. Tokens not received.");
      return;
    }

    const completeLogin = async () => {
      try {
        setStoredTokens(accessToken, refreshToken);

        const meRes = await authApi.getMe();
        if (meRes.success && meRes.data) {
          const roles = meRes.data.roles || [];
          router.replace(getDefaultDashboardPath(roles));
        } else {
          clearStoredTokens();
          setAsyncError(meRes.message || "Failed to retrieve user profile.");
        }
      } catch (err) {
        clearStoredTokens();
        const message = err instanceof Error ? err.message : "Authentication failed.";
        setAsyncError(message);
      }
    };

    completeLogin();
  }, [searchParams, router, errorParam]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6 bg-card border border-border rounded-xl">
          <p className="text-rose-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loading size="lg" text="Completing Google sign-in..." />
    </div>
  );
}