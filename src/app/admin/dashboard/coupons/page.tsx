import { CouponsAdminContent } from "@/components/dashboard/shared/CouponsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminCouponsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <CouponsAdminContent />
    </ProtectedRoute>
  );
}