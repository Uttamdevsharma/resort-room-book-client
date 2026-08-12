import { PaymentsAdminContent } from "@/components/dashboard/shared/PaymentsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function FinancePaymentsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"]} requireStaff>
      <PaymentsAdminContent />
    </ProtectedRoute>
  );
}