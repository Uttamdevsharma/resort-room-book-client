export const STAFF_ROLES: readonly string[] = [
  "SUPER_ADMIN",
  "RESORT_MANAGER",
  "ROOM_MANAGER",
  "BOOKING_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "FINANCE",
];

export const ROLE_DASHBOARD_PATHS: Record<string, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  RESORT_MANAGER: "/resort-manager/dashboard",
  ROOM_MANAGER: "/room-manager/dashboard",
  BOOKING_MANAGER: "/booking-manager/dashboard",
  CUSTOMER_SUPPORT: "/customer-support/dashboard",
  MARKETING_MANAGER: "/marketing-manager/dashboard",
  FINANCE: "/finance/dashboard",
  CUSTOMER: "/customer/dashboard",
};

export function getDefaultDashboardPath(roles: string[]): string {
  for (const role of roles) {
    if (STAFF_ROLES.includes(role)) {
      return ROLE_DASHBOARD_PATHS[role];
    }
  }
  return "/customer/dashboard";
}

export function isStaffUser(roles: string[]): boolean {
  return roles.some((role) => STAFF_ROLES.includes(role));
}