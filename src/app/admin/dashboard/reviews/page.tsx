import { ReviewsAdminContent } from "@/components/dashboard/shared/ReviewsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function AdminReviewsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]} requireStaff>
      <ReviewsAdminContent />
    </ProtectedRoute>
  );
}