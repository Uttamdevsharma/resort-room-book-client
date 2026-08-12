import { RoomsAdminContent } from "@/components/dashboard/shared/RoomsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminRoomsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <RoomsAdminContent />
    </ProtectedRoute>
  );
}