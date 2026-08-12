import { RefundsAdminContent } from "@/components/dashboard/shared/RefundsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminRefundsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <RefundsAdminContent />
    </ProtectedRoute>
  );
}