import { BookingsAdminContent } from "@/components/dashboard/shared/BookingsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function BookingManagerBookingsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "BOOKING_MANAGER"]} requireStaff>
      <BookingsAdminContent />
    </ProtectedRoute>
  );
}