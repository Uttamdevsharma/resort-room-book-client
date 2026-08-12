import { DashboardOverviewContent } from "@/components/dashboard/shared/DashboardOverviewContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function FinanceDashboardPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"]} requireStaff>
      <DashboardOverviewContent />
    </ProtectedRoute>
  );
}