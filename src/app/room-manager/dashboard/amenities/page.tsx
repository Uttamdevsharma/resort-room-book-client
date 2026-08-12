import { AmenitiesAdminContent } from "@/components/dashboard/shared/AmenitiesAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function RoomManagerAmenitiesPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "ROOM_MANAGER"]} requireStaff>
      <AmenitiesAdminContent />
    </ProtectedRoute>
  );
}