import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function FinanceDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout 
      allowedRoles={["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"]} 
      roleName="Finance"
    >
      {children}
    </RoleLayout>
  );
}