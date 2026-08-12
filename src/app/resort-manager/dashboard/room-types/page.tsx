import { RoomTypesAdminContent } from "@/components/dashboard/shared/RoomTypesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerRoomTypesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <RoomTypesAdminContent />
    </ProtectedRoute>
  );
}