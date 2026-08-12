import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function MarketingManagerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout 
      allowedRoles={["SUPER_ADMIN", "RESORT_MANAGER", "MARKETING_MANAGER"]} 
      roleName="Marketing Manager"
    >
      {children}
    </RoleLayout>
  );
}