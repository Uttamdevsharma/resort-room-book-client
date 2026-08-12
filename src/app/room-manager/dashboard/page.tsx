import { DashboardOverviewContent } from "@/components/dashboard/shared/DashboardOverviewContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function RoomManagerDashboardPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"]} requireStaff>
      <DashboardOverviewContent />
    </ProtectedRoute>
  );
}