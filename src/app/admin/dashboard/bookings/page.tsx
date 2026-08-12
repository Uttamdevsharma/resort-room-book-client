import { BookingsAdminContent } from "@/components/dashboard/shared/BookingsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <BookingsAdminContent />
    </ProtectedRoute>
  );
}