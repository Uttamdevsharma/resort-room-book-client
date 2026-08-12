import { CMSAdminContent } from "@/components/dashboard/shared/CMSAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function MarketingManagerCMSPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "MARKETING_MANAGER"]} requireStaff>
      <CMSAdminContent />
    </ProtectedRoute>
  );
}