import { BookingsAdminContent } from "@/components/dashboard/shared/BookingsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function CustomerSupportBookingsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "CUSTOMER_SUPPORT"]} requireStaff>
      <BookingsAdminContent />
    </ProtectedRoute>
  );
}