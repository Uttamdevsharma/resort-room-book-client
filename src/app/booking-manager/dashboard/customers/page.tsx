import { CustomersAdminContent } from "@/components/dashboard/shared/CustomersAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function BookingManagerCustomersPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "BOOKING_MANAGER"]} requireStaff>
      <CustomersAdminContent />
    </ProtectedRoute>
  );
}