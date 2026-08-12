import { RoomTypesAdminContent } from "@/components/dashboard/shared/RoomTypesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminRoomTypesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <RoomTypesAdminContent />
    </ProtectedRoute>
  );
}