import { RoomTypesAdminContent } from "@/components/dashboard/shared/RoomTypesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function RoomManagerRoomTypesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"]} requireStaff>
      <RoomTypesAdminContent />
    </ProtectedRoute>
  );
}