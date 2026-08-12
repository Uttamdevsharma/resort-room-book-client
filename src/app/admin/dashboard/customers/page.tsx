import { CustomersAdminContent } from "@/components/dashboard/shared/CustomersAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminCustomersPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <CustomersAdminContent />
    </ProtectedRoute>
  );
}