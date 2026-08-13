"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Simple Checkout Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container flex h-14 items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground hover:opacity-80 transition-opacity"
            >
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ResortStay
              </span>
            </Link>

            <Link
              href="/rooms"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Rooms
            </Link>
          </div>
        </header>

        {/* Checkout Content */}
        <main className="flex-1 py-10">
          <div className="container max-w-5xl">{children}</div>
        </main>

        <footer className="border-t border-border py-6">
          <p className="container text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Secure 256-bit encrypted checkout powered by Stripe
          </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
