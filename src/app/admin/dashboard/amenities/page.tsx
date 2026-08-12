import { AmenitiesAdminContent } from "@/components/dashboard/shared/AmenitiesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminAmenitiesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <AmenitiesAdminContent />
    </ProtectedRoute>
  );
}