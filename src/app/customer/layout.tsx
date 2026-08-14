"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/LogoMark";
import { Wordmark } from "@/components/brand/Wordmark";
import {
  CalendarCheck,
  CreditCard,
  Receipt,
  Star,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Home,
  BedDouble,
  Palmtree,
  Globe,
} from "lucide-react";

const customerNavItems = [
  { label: "My Bookings", href: "/customer/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/customer/payments", icon: CreditCard },
  { label: "Refunds", href: "/customer/refunds", icon: Receipt },
  { label: "Reviews", href: "/customer/reviews", icon: Star },
  { label: "Notifications", href: "/customer/notifications", icon: Bell },
  { label: "Profile Settings", href: "/customer/profile", icon: User },
];

const publicNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Rooms & Suites", href: "/rooms", icon: BedDouble },
  { label: "Facilities", href: "/facilities", icon: Palmtree },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roles, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-muted/20">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 bottom-0 left-0 z-50 w-64 bg-card border-r border-border
            flex flex-col transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-16 px-6 flex items-center justify-between border-b border-border">
            <Link
              href="/"
              title="Back to CoxBay Resort public website"
              className="group flex items-center gap-2.5 cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:bg-primary-hover group-hover:scale-105 group-hover:shadow-md group-active:scale-95">
                <LogoMark className="h-4 w-4" />
              </div>
              <Wordmark tone="foreground" size="sm" secondary="My Account" />
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-muted-foreground hover:bg-muted cursor-pointer transition-colors duration-200 active:scale-95"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Tag */}
          <div className="px-6 py-3 border-b border-border bg-muted/30">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Signed in as
            </span>
            <p className="text-xs font-bold text-primary truncate mt-0.5">{user?.email || "Customer"}</p>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase px-3 py-1 block">
              Customer Portal
            </span>
            {customerNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer
                    transition-all duration-200 ease-in-out active:scale-[0.97]
                    ${
                      active
                        ? "bg-primary text-white font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted hover:translate-x-0.5"
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-white" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Public website links */}
          <div className="p-4 border-t border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase px-3 py-1 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Explore CoxBay Resort
            </span>
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground cursor-pointer transition-all duration-200 ease-in-out hover:text-foreground hover:bg-muted hover:translate-x-0.5 active:scale-[0.97]"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top header */}
          <header className="h-16 bg-card border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer transition-colors duration-200 active:scale-95"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-base font-bold text-foreground hidden sm:block">Customer Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground leading-tight">{user?.name}</span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {roles[0] || "Customer"}
                </span>
              </div>

              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                {user?.name?.[0]?.toUpperCase() || "C"}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-rose-500 rounded-full w-9 h-9 p-0"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
