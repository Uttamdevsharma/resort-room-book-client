import { DashboardOverviewContent } from "@/components/dashboard/shared/DashboardOverviewContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function CustomerSupportDashboardPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "CUSTOMER_SUPPORT"]} requireStaff>
      <DashboardOverviewContent />
    </ProtectedRoute>
  );
}