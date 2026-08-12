import { PaymentsAdminContent } from "@/components/dashboard/shared/PaymentsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerPaymentsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <PaymentsAdminContent />
    </ProtectedRoute>
  );
}