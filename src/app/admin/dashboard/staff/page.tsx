import { StaffManagementContent } from "@/components/dashboard/shared/StaffManagementContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminStaffPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <StaffManagementContent />
    </ProtectedRoute>
  );
}
