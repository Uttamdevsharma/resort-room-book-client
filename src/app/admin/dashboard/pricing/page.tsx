import { PricingRulesAdminContent } from "@/components/dashboard/shared/PricingRulesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminPricingPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <PricingRulesAdminContent />
    </ProtectedRoute>
  );
}