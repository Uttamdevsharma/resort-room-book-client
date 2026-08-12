import { ResortSettingsContent } from "@/components/dashboard/shared/ResortSettingsContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerResortSettingsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <ResortSettingsContent />
    </ProtectedRoute>
  );
}