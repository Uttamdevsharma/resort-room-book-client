import { FacilitiesAdminContent } from "@/components/dashboard/shared/FacilitiesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminFacilitiesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <FacilitiesAdminContent />
    </ProtectedRoute>
  );
}