import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function RoomManagerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout 
      allowedRoles={["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"]} 
      roleName="Room Manager"
    >
      {children}
    </RoleLayout>
  );
}