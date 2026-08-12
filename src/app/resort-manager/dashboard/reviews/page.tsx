import { ReviewsAdminContent } from "@/components/dashboard/shared/ReviewsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function ResortManagerReviewsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER"]} requireStaff>
      <ReviewsAdminContent />
    </ProtectedRoute>
  );
}