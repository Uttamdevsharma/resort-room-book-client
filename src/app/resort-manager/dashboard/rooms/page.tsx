import { RoomsAdminContent } from "@/components/dashboard/shared/RoomsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerRoomsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <RoomsAdminContent />
    </ProtectedRoute>
  );
}