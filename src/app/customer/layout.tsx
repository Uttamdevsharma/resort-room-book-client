"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalendarCheck, CreditCard, Receipt, Star, Bell, User, LayoutDashboard } from "lucide-react";

const customerNavItems = [
  { label: "My Bookings", href: "/customer/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/customer/payments", icon: CreditCard },
  { label: "Refunds", href: "/customer/refunds", icon: Receipt },
  { label: "Reviews", href: "/customer/reviews", icon: Star },
  { label: "Notifications", href: "/customer/notifications", icon: Bell },
  { label: "Profile Settings", href: "/customer/profile", icon: User },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <div className="pt-20 flex-1">
          <div className="container py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-4">
              <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase px-3 py-1 block">
                  Customer Portal
                </span>
                {customerNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${
                          active
                            ? "bg-primary text-white font-semibold shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-white" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Main Customer Content */}
            <main className="lg:col-span-3 min-w-0">{children}</main>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
