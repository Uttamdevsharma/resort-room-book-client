import { CustomersAdminContent } from "@/components/dashboard/shared/CustomersAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function CustomerSupportCustomersPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "CUSTOMER_SUPPORT"]} requireStaff>
      <CustomersAdminContent />
    </ProtectedRoute>
  );
}