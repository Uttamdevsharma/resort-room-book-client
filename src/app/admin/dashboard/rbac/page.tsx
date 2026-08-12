import { RBACAdminContent } from "@/components/dashboard/shared/RBACAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminRBACPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <RBACAdminContent />
    </ProtectedRoute>
  );
}