"use client";

import { useState, useEffect } from "react";
import { reviewsApi, Review } from "@/lib/api/reviews";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { Star, Search, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";

export function ReviewsAdminContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchReviews = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const res = await reviewsApi.listPublicReviews({
        page: currentPage,
        limit: 10,
      });
      if (res.data) setReviews(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReviews(1);
  };

  const handleModerate = async (reviewId: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      await reviewsApi.moderateReview(reviewId, newStatus);
      fetchReviews(page);
    } catch (err: any) {
      alert(err.message || "Failed to update review status.");
    }
  };

  const getStarRating = (rating: number) => {
    return "&starf;".repeat(rating) + "&star;".repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Guest Reviews Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve guest feedback before public display</p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="p-4 bg-card border border-border rounded-2xl flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by guest name or room type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <Button type="submit" variant="primary">
          Filter
        </Button>
      </form>

      {isLoading ? (
        <Loading text="Loading reviews..." />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="p-4">Guest</th>
                  <th className="p-4">Room Type</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{r.user?.name || "Anonymous"}</td>
                    <td className="p-4 font-medium text-primary">{r.roomType?.name || "Unknown"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 text-lg">{getStarRating(r.rating)}</span>
                        <span className="font-bold text-foreground">{r.rating}/5</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-foreground max-w-xs truncate">{r.title || "&mdash;"}</td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">{r.comment || "&mdash;"}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          r.status === "APPROVED" ? "success" : r.status === "REJECTED" ? "danger" : "warning"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {r.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModerate(r.id, "APPROVED")}
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModerate(r.id, "REJECTED")}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Moderated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(p) => setPage(p)}
            className="p-4"
          />
        </div>
      )}

      {reviews.length === 0 && !isLoading && (
        <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No reviews found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}