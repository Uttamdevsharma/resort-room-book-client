import { CMSAdminContent } from "@/components/dashboard/shared/CMSAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerCMSPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <CMSAdminContent />
    </ProtectedRoute>
  );
}