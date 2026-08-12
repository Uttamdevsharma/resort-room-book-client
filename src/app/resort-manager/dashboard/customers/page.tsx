import { CustomersAdminContent } from "@/components/dashboard/shared/CustomersAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerCustomersPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <CustomersAdminContent />
    </ProtectedRoute>
  );
}