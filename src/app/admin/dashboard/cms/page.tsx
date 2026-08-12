import { CMSAdminContent } from "@/components/dashboard/shared/CMSAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminCMSPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <CMSAdminContent />
    </ProtectedRoute>
  );
}