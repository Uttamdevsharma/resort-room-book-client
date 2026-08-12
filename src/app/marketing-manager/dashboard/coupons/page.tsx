import { CouponsAdminContent } from "@/components/dashboard/shared/CouponsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function MarketingManagerCouponsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "MARKETING_MANAGER"]} requireStaff>
      <CouponsAdminContent />
    </ProtectedRoute>
  );
}