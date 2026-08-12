import { DashboardOverviewContent } from "@/components/dashboard/shared/DashboardOverviewContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function BookingManagerDashboardPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "BOOKING_MANAGER"]} requireStaff>
      <DashboardOverviewContent />
    </ProtectedRoute>
  );
}