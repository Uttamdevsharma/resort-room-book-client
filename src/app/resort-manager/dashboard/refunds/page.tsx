import { RefundsAdminContent } from "@/components/dashboard/shared/RefundsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerRefundsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <RefundsAdminContent />
    </ProtectedRoute>
  );
}