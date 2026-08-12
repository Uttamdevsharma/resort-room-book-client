import { ReviewsAdminContent } from "@/components/dashboard/shared/ReviewsAdminContent";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export default function CustomerSupportReviewsPage() {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "RESORT_MANAGER", "CUSTOMER_SUPPORT"]} requireStaff>
      <ReviewsAdminContent />
    </ProtectedRoute>
  );
}