import { PaymentsAdminContent } from "@/components/dashboard/shared/PaymentsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminPaymentsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <PaymentsAdminContent />
    </ProtectedRoute>
  );
}