import { PricingRulesAdminContent } from "@/components/dashboard/shared/PricingRulesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerPricingPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <PricingRulesAdminContent />
    </ProtectedRoute>
  );
}