import { BookingsAdminContent } from "@/components/dashboard/shared/BookingsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerBookingsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <BookingsAdminContent />
    </ProtectedRoute>
  );
}