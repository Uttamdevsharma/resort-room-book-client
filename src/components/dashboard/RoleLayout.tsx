"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/lib/context/AuthContext";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface RoleLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
  roleName: string;
}

export function RoleLayout({ children, allowedRoles, roleName }: RoleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, roles } = useAuth();

  return (
    <ProtectedRoute requireStaff roles={allowedRoles}>
      <div className="min-h-screen flex bg-muted/20">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top header */}
          <header className="h-16 bg-card border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-base font-bold text-foreground hidden sm:block">
                {roleName} Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground leading-tight">
                  {user?.name}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {roles[0] || "Staff"}
                </span>
              </div>

              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                {user?.name?.[0]?.toUpperCase() || "S"}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-rose-500 rounded-full w-9 h-9 p-0"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}