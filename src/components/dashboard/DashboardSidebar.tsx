"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  DoorOpen,
  Sparkles,
  Palmtree,
  CircleDollarSign,
  CalendarCheck,
  Users,
  CreditCard,
  Receipt,
  Ticket,
  Star,
  Layers,
  ShieldCheck,
  X,
  Home,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles?: string[];
}

const publicNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Rooms & Suites", href: "/rooms", icon: BedDouble },
  { label: "Facilities", href: "/facilities", icon: Palmtree },
];

const sidebarItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resort Settings",
    href: "/dashboard/resort-settings",
    icon: Building2,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER"],
  },
  {
    label: "Room Types",
    href: "/dashboard/room-types",
    icon: BedDouble,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"],
  },
  {
    label: "Physical Rooms",
    href: "/dashboard/rooms",
    icon: DoorOpen,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"],
  },
  {
    label: "Amenities",
    href: "/dashboard/amenities",
    icon: Sparkles,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"],
  },
  {
    label: "Facilities",
    href: "/dashboard/facilities",
    icon: Palmtree,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER"],
  },
  {
    label: "Pricing Rules",
    href: "/dashboard/pricing",
    icon: CircleDollarSign,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"],
  },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: CalendarCheck,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "BOOKING_MANAGER", "CUSTOMER_SUPPORT"],
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "BOOKING_MANAGER", "CUSTOMER_SUPPORT"],
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"],
  },
  {
    label: "Refunds",
    href: "/dashboard/refunds",
    icon: Receipt,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"],
  },
  {
    label: "Coupons",
    href: "/dashboard/coupons",
    icon: Ticket,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "MARKETING_MANAGER"],
  },
  {
    label: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "CUSTOMER_SUPPORT"],
  },
  {
    label: "Homepage CMS",
    href: "/dashboard/cms",
    icon: Layers,
    roles: ["SUPER_ADMIN", "RESORT_MANAGER", "MARKETING_MANAGER"],
  },
  {
    label: "RBAC & Roles",
    href: "/dashboard/rbac",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN"],
  },
];

function getDashboardBasePath(roles: string[]): string {
  if (roles.includes("SUPER_ADMIN")) return "/admin/dashboard";
  if (roles.includes("RESORT_MANAGER")) return "/resort-manager/dashboard";
  if (roles.includes("ROOM_MANAGER")) return "/room-manager/dashboard";
  if (roles.includes("BOOKING_MANAGER")) return "/booking-manager/dashboard";
  if (roles.includes("CUSTOMER_SUPPORT")) return "/customer-support/dashboard";
  if (roles.includes("MARKETING_MANAGER")) return "/marketing-manager/dashboard";
  if (roles.includes("FINANCE")) return "/finance/dashboard";
  return "/dashboard";
}

function getRoleBasedHref(baseHref: string, roles: string[]): string {
  const basePath = getDashboardBasePath(roles);
  if (baseHref === "/dashboard") return basePath;
  return baseHref.replace("/dashboard", basePath);
}

export function DashboardSidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { roles, hasRole } = useAuth();

  const filteredItems = sidebarItems.filter((item) => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  const basePath = getDashboardBasePath(roles);

  const isActive = (href: string) => {
    const roleHref = getRoleBasedHref(href, roles);
    if (roleHref === basePath) return pathname === basePath || pathname === "/dashboard";
    return pathname.startsWith(roleHref);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-card border-r border-border
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <Link href={basePath} className="group flex items-center gap-2.5 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm transition-all duration-300 group-hover:bg-primary-hover group-hover:scale-105 group-hover:shadow-md group-active:scale-95">
              R
            </div>
            <div>
              <span className="font-extrabold text-foreground tracking-tight block text-base leading-none transition-colors duration-200 group-hover:text-primary">
                ResortStay
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Staff Portal
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-muted-foreground hover:bg-muted cursor-pointer transition-colors duration-200 active:scale-95"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Roles Tag */}
        <div className="px-6 py-3 border-b border-border bg-muted/30">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Active Role
          </span>
          <p className="text-xs font-bold text-primary truncate mt-0.5">
            {roles.length > 0 ? roles.join(", ") : "Staff Member"}
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const roleHref = getRoleBasedHref(item.href, roles);
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={roleHref}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer
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
            Explore ResortStay
          </span>
          {publicNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground cursor-pointer transition-all duration-200 ease-in-out hover:text-foreground hover:bg-muted hover:translate-x-0.5 active:scale-[0.97]"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}