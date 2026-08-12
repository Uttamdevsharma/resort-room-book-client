import { ResortSettingsContent } from "@/components/dashboard/shared/ResortSettingsContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminResortSettingsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <ResortSettingsContent />
    </ProtectedRoute>
  );
}