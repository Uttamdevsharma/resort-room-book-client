import { DashboardOverviewContent } from "@/components/dashboard/shared/DashboardOverviewContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function MarketingManagerDashboardPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "MARKETING_MANAGER"]} requireStaff>
      <DashboardOverviewContent />
    </ProtectedRoute>
  );
}