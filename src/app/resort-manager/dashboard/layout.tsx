import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function ResortManagerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout 
      allowedRoles={["SUPER_ADMIN", "RESORT_MANAGER"]} 
      roleName="Resort Manager"
    >
      {children}
    </RoleLayout>
  );
}