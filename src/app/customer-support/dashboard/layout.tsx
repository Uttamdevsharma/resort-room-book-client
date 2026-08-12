import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function CustomerSupportDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout 
      allowedRoles={["SUPER_ADMIN", "RESORT_MANAGER", "CUSTOMER_SUPPORT"]} 
      roleName="Customer Support"
    >
      {children}
    </RoleLayout>
  );
}