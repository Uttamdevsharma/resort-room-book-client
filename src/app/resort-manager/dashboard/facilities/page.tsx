import { FacilitiesAdminContent } from "@/components/dashboard/shared/FacilitiesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerFacilitiesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <FacilitiesAdminContent />
    </ProtectedRoute>
  );
}