import { AmenitiesAdminContent } from "@/components/dashboard/shared/AmenitiesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerAmenitiesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <AmenitiesAdminContent />
    </ProtectedRoute>
  );
}