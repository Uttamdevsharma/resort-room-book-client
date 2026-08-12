import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout allowedRoles={["SUPER_ADMIN"]} roleName="Admin">
      {children}
    </RoleLayout>
  );
}