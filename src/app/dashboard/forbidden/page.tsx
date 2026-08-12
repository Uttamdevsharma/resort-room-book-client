"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Home, ArrowLeft, Lock } from "lucide-react";

interface ForbiddenPageProps {
  reason?: string;
}

export default function ForbiddenPage({ reason }: ForbiddenPageProps) {
  const displayReason = reason || "Insufficient permissions to access this resource.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="h-20 w-20 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center">
          <Lock className="h-10 w-10 text-rose-500" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2">{displayReason}</p>
        </div>

        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-600 dark:text-rose-400">
          <ShieldAlert className="h-4 w-4 inline-block mr-1" />
          <span>Your current role does not have permission to view this page.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/dashboard">
            <Button variant="primary" className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}