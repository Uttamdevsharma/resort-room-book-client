"use client";

import { useState, useEffect } from "react";
import { reviewsApi, Review } from "@/lib/api/reviews";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Star, Plus, AlertCircle } from "lucide-react";

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Review Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [revRes, bookRes, roomRes] = await Promise.allSettled([
        reviewsApi.getMyReviews(),
        bookingsApi.listMyBookings(),
        roomTypesApi.list({ status: "ACTIVE" }),
      ]);

      if (revRes.status === "fulfilled" && revRes.value.data) setReviews(revRes.value.data);
      if (bookRes.status === "fulfilled" && bookRes.value.data) setBookings(bookRes.value.data);
      if (roomRes.status === "fulfilled" && roomRes.value.data) setRoomTypes(roomRes.value.data);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !selectedRoomTypeId) {
      setError("Please select a booking and room type.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await reviewsApi.createReview({
        bookingId: selectedBookingId,
        roomTypeId: selectedRoomTypeId,
        rating,
        title,
        comment,
      });
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">Feedback and ratings left for your resort stays</p>
        </div>
        <Button onClick={() => setModalOpen(true)} variant="primary" className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Write Review
        </Button>
      </div>

      {isLoading ? (
        <Loading text="Loading your reviews..." />
      ) : reviews.length === 0 ? (
        <EmptyState title="No Reviews Submitted" description="Share your stay experience to help future guests!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="p-6 bg-card border border-border rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Badge variant={getStatusBadgeVariant(r.status)}>{r.status}</Badge>
              </div>
              <h3 className="font-bold text-foreground text-base">{r.title || "Resort Stay Review"}</h3>
              <p className="text-sm text-muted-foreground italic">"{r.comment}"</p>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border flex justify-between">
                <span>{r.roomType?.name || "Room Suite"}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Write a Guest Review">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Select Booking
            </label>
            <select
              required
              value={selectedBookingId}
              onChange={(e) => {
                const bId = e.target.value;
                setSelectedBookingId(bId);
                const b = bookings.find((bk) => bk.id === bId);
                if (b?.roomTypeId) {
                  setSelectedRoomTypeId(b.roomTypeId);
                }
              }}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="">-- Choose past booking --</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.bookingNumber} ({new Date(b.checkIn).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Select Room Type
            </label>
            <select
              required
              value={selectedRoomTypeId}
              onChange={(e) => setSelectedRoomTypeId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="">-- Choose room type --</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Rating (1 to 5 Stars)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
              <option value="4">⭐⭐⭐⭐ Very Good (4/5)</option>
              <option value="3">⭐⭐⭐ Average (3/5)</option>
              <option value="2">⭐⭐ Poor (2/5)</option>
              <option value="1">⭐ Terrible (1/5)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unforgettable beachfront stay!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Comment
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell us about the room, dining, and resort hospitality..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
