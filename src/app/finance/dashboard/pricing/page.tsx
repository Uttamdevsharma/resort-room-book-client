import { PricingRulesAdminContent } from "@/components/dashboard/shared/PricingRulesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function FinancePricingPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "FINANCE"]} requireStaff>
      <PricingRulesAdminContent />
    </ProtectedRoute>
  );
}