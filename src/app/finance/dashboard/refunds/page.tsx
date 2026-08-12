import { RefundsAdminContent } from "@/components/dashboard/shared/RefundsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function FinanceRefundsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"]} requireStaff>
      <RefundsAdminContent />
    </ProtectedRoute>
  );
}