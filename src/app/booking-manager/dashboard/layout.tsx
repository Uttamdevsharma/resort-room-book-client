import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function BookingManagerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout 
      allowedRoles={["SUPER_ADMIN", "RESORT_MANAGER", "BOOKING_MANAGER"]} 
      roleName="Booking Manager"
    >
      {children}
    </RoleLayout>
  );
}