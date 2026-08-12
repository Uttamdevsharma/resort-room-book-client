import { RoomsAdminContent } from "@/components/dashboard/shared/RoomsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function RoomManagerRoomsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"]} requireStaff>
      <RoomsAdminContent />
    </ProtectedRoute>
  );
}